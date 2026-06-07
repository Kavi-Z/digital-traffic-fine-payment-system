package traffic.example.traffic_fines_api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "fines")
public class Fine {

    @Id
    private String id;

    @Indexed(unique = true)
    private String referenceNumber;

    private String categoryIdentifier;  

    private String categoryName;        

    private Double amount;

    private String driverLicenseNumber;

    private String driverNic;

    private String driverName;

    // Officer who issued the fine
    private String issuedByOfficerId;
    private String issuedByOfficerName;
    private String issuedByOfficerContact; // for SMS notification

    private String district;

    private String location;

    private String vehicleNumber;

    // UNPAID, PAID, OVERDUE, DISPUTED
    @Builder.Default
    private String status = "UNPAID";

    private LocalDateTime issuedAt;

    private LocalDateTime paidAt;

    // Payment details (stored after payment)
    private String paymentTransactionId;
    private String paymentMethod; // CARD, ONLINE

    private String notes;

    // Merit points deducted
    @Builder.Default
    private Integer pointsDeducted = 0;
}