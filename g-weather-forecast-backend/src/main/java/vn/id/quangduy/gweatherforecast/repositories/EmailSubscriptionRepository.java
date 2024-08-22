package vn.id.quangduy.gweatherforecast.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.id.quangduy.gweatherforecast.models.EmailSubscription;

public interface EmailSubscriptionRepository extends JpaRepository<EmailSubscription, Long> {
    EmailSubscription findByEmail(String email);
    EmailSubscription findByConfirmationToken(String token);
}
