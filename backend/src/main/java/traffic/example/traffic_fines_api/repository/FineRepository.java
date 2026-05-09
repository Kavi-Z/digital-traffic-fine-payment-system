package traffic.example.traffic_fines_api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import traffic.example.traffic_fines_api.entity.Fine;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FineRepository extends MongoRepository<Fine, String> {

    Optional<Fine> findByReferenceNumber(String referenceNumber);

    Optional<Fine> findByReferenceNumberAndCategoryIdentifier(String referenceNumber, String categoryIdentifier);

    List<Fine> findByDriverNic(String driverNic);

    List<Fine> findByVehicleNumber(String vehicleNumber);

    List<Fine> findByDriverLicenseNumber(String driverLicenseNumber);

    List<Fine> findByStatus(String status);

    List<Fine> findByDistrict(String district);

    List<Fine> findByIssuedByOfficerId(String officerId);

    List<Fine> findByDistrictAndStatus(String district, String status);

    List<Fine> findByCategoryIdentifier(String categoryIdentifier);

    // For analytics
    List<Fine> findByIssuedAtBetween(LocalDateTime from, LocalDateTime to);

    List<Fine> findByStatusAndIssuedAtBetween(String status, LocalDateTime from, LocalDateTime to);

    long countByStatus(String status);

    long countByDistrict(String district);

    @Query("{ 'status': 'PAID' }")
    List<Fine> findAllPaid();
}