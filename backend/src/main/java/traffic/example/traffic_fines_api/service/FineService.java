package traffic.example.traffic_fines_api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import traffic.example.traffic_fines_api.dto.FineDto;
import traffic.example.traffic_fines_api.dto.PaymentDto;
import traffic.example.traffic_fines_api.entity.Fine;
import traffic.example.traffic_fines_api.entity.FineCategory;
import traffic.example.traffic_fines_api.entity.Payment;
import traffic.example.traffic_fines_api.entity.User;
import traffic.example.traffic_fines_api.repository.FineCategoryRepository;
import traffic.example.traffic_fines_api.repository.FineRepository;
import traffic.example.traffic_fines_api.repository.PaymentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FineService {

    private final FineRepository fineRepository;
    private final FineCategoryRepository categoryRepository;
    private final PaymentRepository paymentRepository;
    private final SmsService smsService;

    // ============================================================
    // Issue a new fine (officer action)
    // ============================================================
    public FineDto.FullFineResponse issueFine(FineDto.IssueFineRequest request, User officer) {
        FineCategory category = categoryRepository.findByIdentifier(request.getCategoryIdentifier())
                .orElseThrow(() -> new RuntimeException("Invalid category identifier: " + request.getCategoryIdentifier()));

        String referenceNumber = generateReferenceNumber();

        Fine fine = Fine.builder()
                .referenceNumber(referenceNumber)
                .categoryIdentifier(category.getIdentifier())
                .categoryName(category.getName())
                .amount(category.getAmount())
                .driverLicenseNumber(request.getDriverLicenseNumber())
                .driverNic(request.getDriverNic())
                .driverName(request.getDriverName())
                .vehicleNumber(request.getVehicleNumber())
                .location(request.getLocation())
                .district(officer.getDistrict())
                .issuedByOfficerId(officer.getId())
                .issuedByOfficerName(officer.getFullName())
                .issuedByOfficerContact(officer.getContactNumber())
                .status("UNPAID")
                .issuedAt(LocalDateTime.now())
                .pointsDeducted(category.getPointsDeducted())
                .notes(request.getNotes())
                .build();

        Fine saved = fineRepository.save(fine);
        log.info("Fine issued: {} by officer {}", referenceNumber, officer.getUsername());
        return mapToFullResponse(saved);
    }

    // ============================================================
    // Verify a fine before payment (public)
    // ============================================================
    public FineDto.FineDetailsResponse verifyFine(String referenceNumber, String categoryIdentifier) {
        Fine fine = fineRepository.findByReferenceNumberAndCategoryIdentifier(referenceNumber, categoryIdentifier)
                .orElseThrow(() -> new RuntimeException("Fine not found. Please check your reference number and category."));

        if ("PAID".equals(fine.getStatus())) {
            throw new RuntimeException("This fine has already been paid.");
        }

        return mapToPublicResponse(fine);
    }

    // ============================================================
    // Find fine by reference number only (public, for dispute)
    // ============================================================
    public FineDto.FineDetailsResponse findByReferenceNumber(String referenceNumber) {
        Fine fine = fineRepository.findByReferenceNumber(referenceNumber)
                .orElseThrow(() -> new RuntimeException("Fine not found with reference: " + referenceNumber));
        return mapToPublicResponse(fine);
    }

    // ============================================================
    // Process payment (public)
    // ============================================================
    public PaymentDto.PaymentReceiptResponse processFinePayment(PaymentDto.PayFineRequest request) {
        Fine fine = fineRepository.findByReferenceNumberAndCategoryIdentifier(
                        request.getReferenceNumber(), request.getCategoryIdentifier())
                .orElseThrow(() -> new RuntimeException("Fine not found."));

        if ("PAID".equals(fine.getStatus())) {
            throw new RuntimeException("This fine has already been paid.");
        }

        // Generate transaction ID
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        // Mask card number (keep only last 4 digits)
        String maskedCard = null;
        if (request.getCardNumber() != null && request.getCardNumber().length() >= 4) {
            maskedCard = "**** **** **** " + request.getCardNumber().substring(request.getCardNumber().length() - 4);
        }

        // Update fine status
        fine.setStatus("PAID");
        fine.setPaidAt(LocalDateTime.now());
        fine.setPaymentTransactionId(transactionId);
        fine.setPaymentMethod(request.getPaymentMethod());
        fineRepository.save(fine);

        // Save payment record
        Payment payment = Payment.builder()
                .fineId(fine.getId())
                .referenceNumber(fine.getReferenceNumber())
                .amount(fine.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .maskedCardNumber(maskedCard)
                .cardHolderName(request.getCardHolderName())
                .transactionId(transactionId)
                .status("SUCCESS")
                .paidAt(LocalDateTime.now())
                .paidByName(request.getPayerName())
                .paidByContact(request.getPayerContact())
                .officerContact(fine.getIssuedByOfficerContact())
                .smsSent(false)
                .build();

        // Send SMS to officer
        boolean smsSent = false;
        if (fine.getIssuedByOfficerContact() != null && !fine.getIssuedByOfficerContact().isEmpty()) {
            smsSent = smsService.sendPaymentNotification(
                    fine.getIssuedByOfficerContact(),
                    fine.getIssuedByOfficerName(),
                    fine.getReferenceNumber(),
                    fine.getDriverName() != null ? fine.getDriverName() : fine.getDriverLicenseNumber(),
                    fine.getAmount()
            );
        }

        payment.setSmsSent(smsSent);
        paymentRepository.save(payment);

        log.info("Payment processed: {} -> TXN: {}, SMS sent: {}", fine.getReferenceNumber(), transactionId, smsSent);

        return PaymentDto.PaymentReceiptResponse.builder()
                .transactionId(transactionId)
                .referenceNumber(fine.getReferenceNumber())
                .categoryName(fine.getCategoryName())
                .amount(fine.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .maskedCardNumber(maskedCard)
                .cardHolderName(request.getCardHolderName())
                .status("SUCCESS")
                .paidAt(LocalDateTime.now())
                .driverLicenseNumber(fine.getDriverLicenseNumber())
                .driverName(fine.getDriverName())
                .district(fine.getDistrict())
                .officerName(fine.getIssuedByOfficerName())
                .smsSent(smsSent)
                .build();
    }

    // ============================================================
    // Get fines for a driver (public search)
    // ============================================================
    public List<FineDto.FineDetailsResponse> searchByNic(String nic) {
        return fineRepository.findByDriverNic(nic)
                .stream().map(this::mapToPublicResponse).collect(Collectors.toList());
    }

    public List<FineDto.FineDetailsResponse> searchByVehicle(String vehicleNumber) {
        return fineRepository.findByVehicleNumber(vehicleNumber.toUpperCase())
                .stream().map(this::mapToPublicResponse).collect(Collectors.toList());
    }

    // ============================================================
    // Officer - get my issued fines
    // ============================================================
    public List<FineDto.FullFineResponse> getOfficerFines(User officer) {
        return fineRepository.findByIssuedByOfficerId(officer.getId())
                .stream().map(this::mapToFullResponse).collect(Collectors.toList());
    }

    // ============================================================
    // Admin - get all fines
    // ============================================================
    public List<FineDto.FullFineResponse> getAllFines() {
        return fineRepository.findAll()
                .stream().map(this::mapToFullResponse).collect(Collectors.toList());
    }

    public List<FineDto.FullFineResponse> getFinesByDistrict(String district) {
        return fineRepository.findByDistrict(district)
                .stream().map(this::mapToFullResponse).collect(Collectors.toList());
    }

    // ============================================================
    // Helpers
    // ============================================================
    private String generateReferenceNumber() {
        int year = LocalDateTime.now().getYear();
        String uuid = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        String ref = "TF-" + year + "-" + uuid;
        // Ensure uniqueness
        while (fineRepository.findByReferenceNumber(ref).isPresent()) {
            uuid = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
            ref = "TF-" + year + "-" + uuid;
        }
        return ref;
    }

    public FineDto.FineDetailsResponse mapToPublicResponse(Fine fine) {
        return FineDto.FineDetailsResponse.builder()
                .id(fine.getId())
                .referenceNumber(fine.getReferenceNumber())
                .categoryIdentifier(fine.getCategoryIdentifier())
                .categoryName(fine.getCategoryName())
                .amount(fine.getAmount())
                .driverLicenseNumber(fine.getDriverLicenseNumber())
                .driverName(fine.getDriverName())
                .vehicleNumber(fine.getVehicleNumber())
                .district(fine.getDistrict())
                .location(fine.getLocation())
                .status(fine.getStatus())
                .issuedAt(fine.getIssuedAt())
                .paidAt(fine.getPaidAt())
                .issuedByOfficerName(fine.getIssuedByOfficerName())
                .pointsDeducted(fine.getPointsDeducted())
                .build();
    }

    public FineDto.FullFineResponse mapToFullResponse(Fine fine) {
        return FineDto.FullFineResponse.builder()
                .id(fine.getId())
                .referenceNumber(fine.getReferenceNumber())
                .categoryIdentifier(fine.getCategoryIdentifier())
                .categoryName(fine.getCategoryName())
                .amount(fine.getAmount())
                .driverLicenseNumber(fine.getDriverLicenseNumber())
                .driverNic(fine.getDriverNic())
                .driverName(fine.getDriverName())
                .vehicleNumber(fine.getVehicleNumber())
                .district(fine.getDistrict())
                .location(fine.getLocation())
                .status(fine.getStatus())
                .issuedByOfficerId(fine.getIssuedByOfficerId())
                .issuedByOfficerName(fine.getIssuedByOfficerName())
                .issuedByOfficerContact(fine.getIssuedByOfficerContact())
                .issuedAt(fine.getIssuedAt())
                .paidAt(fine.getPaidAt())
                .paymentTransactionId(fine.getPaymentTransactionId())
                .paymentMethod(fine.getPaymentMethod())
                .notes(fine.getNotes())
                .pointsDeducted(fine.getPointsDeducted())
                .build();
    }
}