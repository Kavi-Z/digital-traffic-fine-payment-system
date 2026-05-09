package traffic.example.traffic_fines_api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import traffic.example.traffic_fines_api.dto.AuthDto;
import traffic.example.traffic_fines_api.entity.User;
import traffic.example.traffic_fines_api.repository.UserRepository;
import traffic.example.traffic_fines_api.service.AnalyticsService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get admin dashboard summary - real MongoDB data.
     * GET /api/admin/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    /**
     * Get all officers.
     * GET /api/admin/officers
     */
    @GetMapping("/officers")
    public ResponseEntity<?> getAllOfficers() {
        List<User> officers = userRepository.findByRole("OFFICER");
        // Remove password before returning
        officers.forEach(o -> o.setPassword(null));
        return ResponseEntity.ok(officers);
    }

    /**
     * Create a new officer account (admin only).
     * POST /api/admin/officers
     */
    @PostMapping("/officers")
    public ResponseEntity<?> createOfficer(@Valid @RequestBody AuthDto.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already taken."));
        }

        User officer = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .contactNumber(request.getContactNumber())
                .district(request.getDistrict())
                .badgeNumber(request.getBadgeNumber())
                .role("OFFICER")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(officer);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    /**
     * Delete an officer account.
     * DELETE /api/admin/officers/{id}
     */
    @DeleteMapping("/officers/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteOfficer(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Officer deleted successfully."));
    }

    /**
     * Get all users (Super Admin only).
     * GET /api/admin/users
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    /**
     * Toggle officer enabled/disabled status.
     * PATCH /api/admin/officers/{id}/toggle
     */
    @PatchMapping("/officers/{id}/toggle")
    public ResponseEntity<?> toggleOfficerStatus(@PathVariable String id) {
        User officer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        officer.setEnabled(!officer.isEnabled());
        userRepository.save(officer);
        return ResponseEntity.ok(Map.of(
                "message", "Status updated.",
                "enabled", officer.isEnabled()
        ));
    }
}