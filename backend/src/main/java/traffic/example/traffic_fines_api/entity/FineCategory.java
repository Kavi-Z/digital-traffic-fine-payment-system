package traffic.example.traffic_fines_api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "fine_categories")
public class FineCategory {

    @Id
    private String id;

    @Indexed(unique = true)
    private String identifier; // e.g. "SPD"

    private String name;       // e.g. "Speeding"

    private Double amount;     // Fine amount in LKR

    private Integer pointsDeducted; // Merit points to deduct

    private String description;

    private boolean active = true;
}