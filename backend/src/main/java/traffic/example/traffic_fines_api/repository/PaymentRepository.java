package traffic.example.traffic_fines_api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import traffic.example.traffic_fines_api.entity.Payment;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {

    Optional<Payment> findByFineId(String fineId);

    Optional<Payment> findByTransactionId(String transactionId);

    Optional<Payment> findByReferenceNumber(String referenceNumber);

    List<Payment> findByStatus(String status);
}