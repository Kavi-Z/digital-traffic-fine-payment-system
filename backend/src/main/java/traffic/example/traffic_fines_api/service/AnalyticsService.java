package traffic.example.traffic_fines_api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import traffic.example.traffic_fines_api.dto.AnalyticsDto;
import traffic.example.traffic_fines_api.entity.Fine;
import traffic.example.traffic_fines_api.repository.FineRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final FineRepository fineRepository;

    public AnalyticsDto.DashboardSummary getDashboardSummary() {
        List<Fine> allFines = fineRepository.findAll();

        long totalIssued = allFines.size();
        long paid = allFines.stream().filter(f -> "PAID".equals(f.getStatus())).count();
        long unpaid = allFines.stream().filter(f -> "UNPAID".equals(f.getStatus())).count();
        long overdue = allFines.stream().filter(f -> "OVERDUE".equals(f.getStatus())).count();

        double totalCollected = allFines.stream()
                .filter(f -> "PAID".equals(f.getStatus()))
                .mapToDouble(Fine::getAmount)
                .sum();

        double totalPending = allFines.stream()
                .filter(f -> "UNPAID".equals(f.getStatus()) || "OVERDUE".equals(f.getStatus()))
                .mapToDouble(Fine::getAmount)
                .sum();

        return AnalyticsDto.DashboardSummary.builder()
                .totalFinesIssued(totalIssued)
                .totalPaid(paid)
                .totalUnpaid(unpaid)
                .totalOverdue(overdue)
                .totalCollected(totalCollected)
                .totalPending(totalPending)
                .districtStats(buildDistrictStats(allFines))
                .categoryStats(buildCategoryStats(allFines))
                .monthlyTrend(buildMonthlyTrend(allFines))
                .build();
    }

    private List<AnalyticsDto.DistrictStat> buildDistrictStats(List<Fine> fines) {
        Map<String, List<Fine>> byDistrict = fines.stream()
                .filter(f -> f.getDistrict() != null)
                .collect(Collectors.groupingBy(Fine::getDistrict));

        return byDistrict.entrySet().stream()
                .map(e -> AnalyticsDto.DistrictStat.builder()
                        .district(e.getKey())
                        .count(e.getValue().size())
                        .totalAmount(e.getValue().stream()
                                .filter(f -> "PAID".equals(f.getStatus()))
                                .mapToDouble(Fine::getAmount)
                                .sum())
                        .build())
                .sorted(Comparator.comparingDouble(AnalyticsDto.DistrictStat::getTotalAmount).reversed())
                .collect(Collectors.toList());
    }

    private List<AnalyticsDto.CategoryStat> buildCategoryStats(List<Fine> fines) {
        Map<String, List<Fine>> byCategory = fines.stream()
                .filter(f -> f.getCategoryIdentifier() != null)
                .collect(Collectors.groupingBy(Fine::getCategoryIdentifier));

        return byCategory.entrySet().stream()
                .map(e -> {
                    List<Fine> catFines = e.getValue();
                    String catName = catFines.isEmpty() ? e.getKey() : catFines.get(0).getCategoryName();
                    return AnalyticsDto.CategoryStat.builder()
                            .categoryIdentifier(e.getKey())
                            .categoryName(catName)
                            .count(catFines.size())
                            .totalAmount(catFines.stream()
                                    .filter(f -> "PAID".equals(f.getStatus()))
                                    .mapToDouble(Fine::getAmount)
                                    .sum())
                            .build();
                })
                .sorted(Comparator.comparingDouble(AnalyticsDto.CategoryStat::getTotalAmount).reversed())
                .collect(Collectors.toList());
    }

    private List<AnalyticsDto.MonthlyTrend> buildMonthlyTrend(List<Fine> fines) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");

        Map<String, List<Fine>> byMonth = fines.stream()
                .filter(f -> f.getIssuedAt() != null)
                .collect(Collectors.groupingBy(f -> f.getIssuedAt().format(fmt)));

        // Last 12 months
        List<String> last12Months = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 11; i >= 0; i--) {
            last12Months.add(now.minusMonths(i).format(fmt));
        }

        return last12Months.stream()
                .map(month -> {
                    List<Fine> monthFines = byMonth.getOrDefault(month, Collections.emptyList());
                    double amount = monthFines.stream()
                            .filter(f -> "PAID".equals(f.getStatus()))
                            .mapToDouble(Fine::getAmount)
                            .sum();
                    return AnalyticsDto.MonthlyTrend.builder()
                            .month(month)
                            .count(monthFines.size())
                            .amount(amount)
                            .build();
                })
                .collect(Collectors.toList());
    }
}