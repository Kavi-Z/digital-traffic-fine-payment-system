package traffic.example.traffic_fines_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class DriverDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DriverRecordResponse {
        private String searchQuery;
        private String searchType; // NIC or VEHICLE
        private String driverName;
        private String licenseNumber;
        private String nic;
        private String licenseStatus; // ACTIVE, SUSPENDED
        private int meritScore;       // out of 100
        private int totalFines;
        private int paidFines;
        private int unpaidFines;
        private double totalAmountDue;
        private List<FineDto.FineDetailsResponse> records;
    }
}