package traffic.example.traffic_fines_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class AnalyticsDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardSummary {
        private long totalFinesIssued;
        private long totalPaid;
        private long totalUnpaid;
        private long totalOverdue;
        private double totalCollected;       // sum of paid fines
        private double totalPending;         // sum of unpaid+overdue fines
        private List<DistrictStat> districtStats;
        private List<CategoryStat> categoryStats;
        private List<MonthlyTrend> monthlyTrend;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DistrictStat {
        private String district;
        private long count;
        private double totalAmount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryStat {
        private String categoryIdentifier;
        private String categoryName;
        private long count;
        private double totalAmount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTrend {
        private String month;   // e.g. "Jan 2026"
        private long count;
        private double amount;
    }
}