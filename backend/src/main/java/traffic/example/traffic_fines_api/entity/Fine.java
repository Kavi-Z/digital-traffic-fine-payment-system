package traffic.example.traffic_fines_api.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "fines")
@Data 
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(unique = true, nullable = false)
    private String referenceNumber; 

    @Column(nullable = false)
    private String categoryIdentifier;  

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String driverLicenseNumber;

    @Column(nullable = false)
    private String status = "UNPAID";

    private LocalDateTime issuedAt;
     
    @PrePersist
    protected void onCreate() {
        this.issuedAt = LocalDateTime.now();
    }
}