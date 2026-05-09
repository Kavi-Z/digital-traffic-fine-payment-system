package traffic.example.traffic_fines_api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class PaymentDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayFineRequest {
        @NotBlank(message = "Reference number is required")
        private String referenceNumber;

        @NotBlank(message = "Category identifier is required")
        private String categoryIdentifier;

        // Payer details
        private String payerName;
        private String payerContact;

        // Payment method: CARD, ONLINE
        @NotBlank(message = "Payment method is required")
        private String paymentMethod;

        // Card details (only for CARD payment — never store raw, only mask)
        private String cardNumber;    // will be masked before storage
        private String cardExpiry;
        private String cardCvv;       // never stored
        private String cardHolderName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentReceiptResponse {
        private String transactionId;
        private String referenceNumber;
        private String categoryName;
        private Double amount;
        private String paymentMethod;
        private String maskedCardNumber;
        private String cardHolderName;
        private String status;
        private LocalDateTime paidAt;
        private String driverLicenseNumber;
        private String driverName;
        private String district;
        private String officerName;
        private boolean smsSent;
    }
}