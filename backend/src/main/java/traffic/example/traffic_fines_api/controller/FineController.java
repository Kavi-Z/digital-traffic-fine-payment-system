package traffic.example.traffic_fines_api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import traffic.example.traffic_fines_api.dto.FineDto;
import traffic.example.traffic_fines_api.dto.PaymentDto;
import traffic.example.traffic_fines_api.entity.User;
import traffic.example.traffic_fines_api.repository.FineCategoryRepository;
import traffic.example.traffic_fines_api.service.FineService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;
    private final FineCategoryRepository categoryRepository;

    // =====================================================
    // PUBLIC ENDPOINTS (no auth required)
    // =====================================================

    /**
     * Verify a fine using reference number and category.
     * Used by the public payment web portal and mobile app.
     * POST /api/fines/verify
     */
    @PostMapping("/fines/verify")
    public ResponseEntity<?> verifyFine(@Valid @RequestBody FineDto.VerifyFineRequest request) {
        try {
            FineDto.FineDetailsResponse fine = fineService.verifyFine(
                    request.getReferenceNumber(), request.getCategoryIdentifier());
            return ResponseEntity.ok(fine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Pay a fine.
     * Used by the public web portal and mobile app.
     * POST /api/fines/pay
     */
    @PostMapping("/fines/pay")
    public ResponseEntity<?> payFine(@Valid @RequestBody PaymentDto.PayFineRequest request) {
        try {
            PaymentDto.PaymentReceiptResponse receipt = fineService.processFinePayment(request);
            return ResponseEntity.ok(receipt);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get all fine categories with amounts.
     * GET /api/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findByActive(true));
    }

    /**
     * Public driver record search by NIC or vehicle number.
     * GET /api/drivers/search?type=NIC&query=...
     */
    @GetMapping("/drivers/search")
    public ResponseEntity<?> searchDriver(
            @RequestParam String type,
            @RequestParam String query) {

        List<FineDto.FineDetailsResponse> fines;
        if ("VEHICLE".equalsIgnoreCase(type)) {
            fines = fineService.searchByVehicle(query);
        } else {
            fines = fineService.searchByNic(query);
        }

        if (fines.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "No records found.", "records", List.of()));
        }

        long paid = fines.stream().filter(f -> "PAID".equals(f.getStatus())).count();
        long unpaid = fines.stream().filter(f -> !"PAID".equals(f.getStatus())).count();
        double totalDue = fines.stream()
                .filter(f -> !"PAID".equals(f.getStatus()))
                .mapToDouble(FineDto.FineDetailsResponse::getAmount)
                .sum();

        // Compute a basic merit score (starts at 100, minus points for each fine)
        int meritScore = 100;
        for (FineDto.FineDetailsResponse fine : fines) {
            if (fine.getPointsDeducted() != null) {
                meritScore -= fine.getPointsDeducted();
            }
        }
        meritScore = Math.max(0, meritScore);

        return ResponseEntity.ok(Map.of(
                "searchQuery", query,
                "searchType", type.toUpperCase(),
                "totalFines", fines.size(),
                "paidFines", paid,
                "unpaidFines", unpaid,
                "totalAmountDue", totalDue,
                "meritScore", meritScore,
                "licenseStatus", meritScore <= 0 ? "SUSPENDED" : "ACTIVE",
                "records", fines
        ));
    }

    /**
     * Look up a fine by reference number only (public, for dispute portal).
     * GET /api/fines/{referenceNumber}
     */
    @GetMapping("/fines/{referenceNumber}")
    public ResponseEntity<?> getFineByReferencePublic(@PathVariable String referenceNumber) {
        try {
            FineDto.FineDetailsResponse fine = fineService.findByReferenceNumber(referenceNumber);
            return ResponseEntity.ok(fine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // =====================================================
    // OFFICER ENDPOINTS
    // =====================================================

    /**
     * Issue a new traffic fine.
     * POST /api/officer/fines
     */
    @PostMapping("/officer/fines")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> issueFine(
            @Valid @RequestBody FineDto.IssueFineRequest request,
            @AuthenticationPrincipal User officer) {
        try {
            FineDto.FullFineResponse fine = fineService.issueFine(request, officer);
            return ResponseEntity.ok(fine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get all fines issued by the currently logged-in officer.
     * GET /api/officer/fines
     */
    @GetMapping("/officer/fines")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> getMyFines(@AuthenticationPrincipal User officer) {
        return ResponseEntity.ok(fineService.getOfficerFines(officer));
    }

    // =====================================================
    // ADMIN ENDPOINTS
    // =====================================================

    /**
     * Get all fines in the system.
     * GET /api/admin/fines
     */
    @GetMapping("/admin/fines")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> getAllFines(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String status) {

        if (district != null && !district.isEmpty()) {
            return ResponseEntity.ok(fineService.getFinesByDistrict(district));
        }
        return ResponseEntity.ok(fineService.getAllFines());
    }

    /**
     * Get a specific fine by reference number (admin only).
     * GET /api/admin/fines/{referenceNumber}
     */
    @GetMapping("/admin/fines/{referenceNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> getFineByRef(@PathVariable String referenceNumber) {
        return fineService.getAllFines().stream()
                .filter(f -> f.getReferenceNumber().equals(referenceNumber))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}