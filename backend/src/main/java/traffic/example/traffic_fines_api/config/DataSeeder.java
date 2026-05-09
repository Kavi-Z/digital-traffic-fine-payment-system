package traffic.example.traffic_fines_api.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import traffic.example.traffic_fines_api.entity.FineCategory;
import traffic.example.traffic_fines_api.entity.User;
import traffic.example.traffic_fines_api.repository.FineCategoryRepository;
import traffic.example.traffic_fines_api.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FineCategoryRepository fineCategoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedCategories();
        seedAdminUsers();
    }

    private void seedCategories() {
        if (fineCategoryRepository.count() > 0) {
            log.info("Fine categories already seeded. Skipping.");
            return;
        }

        List<FineCategory> categories = List.of(
                FineCategory.builder().identifier("SPD").name("Speeding").amount(3500.0).pointsDeducted(15).description("Exceeding speed limit").active(true).build(),
                FineCategory.builder().identifier("SIG").name("Signal Violation").amount(2500.0).pointsDeducted(10).description("Running a red light or ignoring traffic signals").active(true).build(),
                FineCategory.builder().identifier("LIC").name("No License").amount(5000.0).pointsDeducted(20).description("Driving without a valid license").active(true).build(),
                FineCategory.builder().identifier("PKG").name("Illegal Parking").amount(1500.0).pointsDeducted(5).description("Parking in a prohibited zone").active(true).build(),
                FineCategory.builder().identifier("DRK").name("Drunk Driving").amount(25000.0).pointsDeducted(35).description("Driving under influence of alcohol or drugs").active(true).build(),
                FineCategory.builder().identifier("MOB").name("Mobile Phone Use").amount(2000.0).pointsDeducted(10).description("Using a mobile phone while driving").active(true).build(),
                FineCategory.builder().identifier("SBT").name("No Seatbelt").amount(1000.0).pointsDeducted(5).description("Not wearing a seatbelt").active(true).build(),
                FineCategory.builder().identifier("OVL").name("Overloading").amount(4000.0).pointsDeducted(10).description("Vehicle overloaded beyond permitted weight").active(true).build(),
                FineCategory.builder().identifier("OTH").name("Other Violation").amount(1000.0).pointsDeducted(5).description("Other traffic violation").active(true).build()
        );

        fineCategoryRepository.saveAll(categories);
        log.info("Seeded {} fine categories.", categories.size());
    }

    private void seedAdminUsers() {
        // Seed Super Admin
        if (!userRepository.existsByUsername("superadmin")) {
            User superAdmin = User.builder()
                    .username("superadmin")
                    .password(passwordEncoder.encode("SuperAdmin@123"))
                    .fullName("HQ Super Administrator")
                    .contactNumber("+94112345678")
                    .role("SUPER_ADMIN")
                    .district("Colombo")
                    .badgeNumber("SA-001")
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(superAdmin);
            log.info("Super Admin created: username=superadmin, password=SuperAdmin@123");
        }

        // Seed Admin
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("Regional Administrator")
                    .contactNumber("+94112345679")
                    .role("ADMIN")
                    .district("Colombo")
                    .badgeNumber("AD-001")
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(admin);
            log.info("Admin created: username=admin, password=Admin@123");
        }

        // Seed a sample Officer
        if (!userRepository.existsByUsername("officer001")) {
            User officer = User.builder()
                    .username("officer001")
                    .password(passwordEncoder.encode("Officer@123"))
                    .fullName("P. Karunaratne")
                    .contactNumber("+94771234567")
                    .role("OFFICER")
                    .district("Colombo")
                    .badgeNumber("OFF-001")
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(officer);
            log.info("Officer created: username=officer001, password=Officer@123");
        }

        if (!userRepository.existsByUsername("officer002")) {
            User officer2 = User.builder()
                    .username("officer002")
                    .password(passwordEncoder.encode("Officer@123"))
                    .fullName("S. Perera")
                    .contactNumber("+94777654321")
                    .role("OFFICER")
                    .district("Kandy")
                    .badgeNumber("OFF-002")
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(officer2);
            log.info("Officer created: username=officer002, password=Officer@123");
        }
    }
}