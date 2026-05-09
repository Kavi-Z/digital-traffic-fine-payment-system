package traffic.example.traffic_fines_api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import traffic.example.traffic_fines_api.entity.FineCategory;

import java.util.List;
import java.util.Optional;

@Repository
public interface FineCategoryRepository extends MongoRepository<FineCategory, String> {

    Optional<FineCategory> findByIdentifier(String identifier);

    List<FineCategory> findByActive(boolean active);

    boolean existsByIdentifier(String identifier);
}