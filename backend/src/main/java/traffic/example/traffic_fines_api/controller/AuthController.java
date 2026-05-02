package traffic.example.traffic_fines_api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import traffic.example.traffic_fines_api.entity.User;
import traffic.example.traffic_fines_api.repository.UserRepository;
import traffic.example.traffic_fines_api.security.JwtService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // Updated RegisterRequest to include the new database columns
    public record RegisterRequest(String username, String password, String fullName, String contactNumber, String role) {}
    public record AuthRequest(String username, String password) {}
    public record AuthResponse(String token) {}

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody RegisterRequest request) {
        
        // Prevent duplicate usernames
        if (repository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already taken!");
        }
 
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setContactNumber(request.contactNumber());
        user.setRole(request.role());
         
        repository.save(user);
 
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
         
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
 
        User user = repository.findByUsername(request.username()).orElseThrow();
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(token));
    }
}