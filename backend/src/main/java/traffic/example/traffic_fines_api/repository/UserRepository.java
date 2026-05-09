package traffic.example.traffic_fines_api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import traffic.example.traffic_fines_api.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    List<User> findByRole(String role);

    List<User> findByDistrict(String district);

    Optional<User> findByBadgeNumber(String badgeNumber);
}