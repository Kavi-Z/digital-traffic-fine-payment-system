package traffic.example.traffic_fines_api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {

    @Id
    private String id;

    private String fineId;

    private String referenceNumber;

    private Double amount;

    private String paymentMethod; // CARD, ONLINE

    // Masked card details (never store raw card data)
    private String maskedCardNumber; // e.g. "**** **** **** 1234"

    private String cardHolderName;

    // Transaction reference from payment gateway
    private String transactionId;

    private String status; // SUCCESS, FAILED

    private LocalDateTime paidAt;

    private String paidByName;

    private String paidByContact;

    // SMS sent to officer?
    private boolean smsSent = false;

    private String officerContact;
}