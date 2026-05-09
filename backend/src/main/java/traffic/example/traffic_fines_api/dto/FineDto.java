package traffic.example.traffic_fines_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class FineDto {

    // Request to issue a new fine (officer)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IssueFineRequest {
        @NotBlank(message = "Category identifier is required")
        private String categoryIdentifier;

        @NotBlank(message = "Driver license number is required")
        private String driverLicenseNumber;

        private String driverNic;

        private String driverName;

        private String vehicleNumber;

        private String location;

        private String notes;
    }

    // Request to verify a fine before payment (public)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyFineRequest {
        @NotBlank(message = "Reference number is required")
        private String referenceNumber;

        @NotBlank(message = "Category identifier is required")
        private String categoryIdentifier;
    }

    // Response with fine details (public-safe, no officer contact)
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FineDetailsResponse {
        private String id;
        private String referenceNumber;
        private String categoryIdentifier;
        private String categoryName;
        private Double amount;
        private String driverLicenseNumber;
        private String driverName;
        private String vehicleNumber;
        private String district;
        private String location;
        private String status;
        private LocalDateTime issuedAt;
        private LocalDateTime paidAt;
        private String issuedByOfficerName;
        private Integer pointsDeducted;
    }

    // Full fine response (for admin/officer)
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FullFineResponse {
        private String id;
        private String referenceNumber;
        private String categoryIdentifier;
        private String categoryName;
        private Double amount;
        private String driverLicenseNumber;
        private String driverNic;
        private String driverName;
        private String vehicleNumber;
        private String district;
        private String location;
        private String status;
        private String issuedByOfficerId;
        private String issuedByOfficerName;
        private String issuedByOfficerContact;
        private LocalDateTime issuedAt;
        private LocalDateTime paidAt;
        private String paymentTransactionId;
        private String paymentMethod;
        private String notes;
        private Integer pointsDeducted;
    }
}