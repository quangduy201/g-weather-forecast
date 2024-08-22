package vn.id.quangduy.gweatherforecast.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.id.quangduy.gweatherforecast.models.EmailSubscription;
import vn.id.quangduy.gweatherforecast.repositories.EmailSubscriptionRepository;

import java.util.UUID;

@Service
public class EmailSubscriptionService {

    private final EmailSubscriptionRepository emailSubscriptionRepository;
    private final EmailService emailService;

    @Autowired
    public EmailSubscriptionService(EmailSubscriptionRepository emailSubscriptionRepository, EmailService emailService) {
        this.emailSubscriptionRepository = emailSubscriptionRepository;
        this.emailService = emailService;
    }

    @Transactional
    public void register(String email, String location) {
        String token = UUID.randomUUID().toString();
        EmailSubscription subscription = new EmailSubscription(email, location, false, token);
        emailSubscriptionRepository.save(subscription);

        // Send confirmation email
        emailService.sendConfirmationEmail(email, token);
    }

    @Transactional
    public boolean confirmSubscription(String token) {
        EmailSubscription subscription = emailSubscriptionRepository.findByConfirmationToken(token);
        if (subscription != null && !subscription.isConfirmed()) {
            subscription.setConfirmed(true);
            emailSubscriptionRepository.save(subscription);
            return true;
        }
        return false;
    }

    @Transactional
    public void unsubscribe(String email) {
        EmailSubscription subscription = emailSubscriptionRepository.findByEmail(email);
        if (subscription != null && subscription.isConfirmed()) {
            String token = UUID.randomUUID().toString();
            subscription.setConfirmationToken(token);
            emailSubscriptionRepository.save(subscription);

            // Send unsubscription confirmation email
            emailService.sendUnsubscriptionEmail(email, token);
        }
    }

    @Transactional
    public boolean confirmUnsubscription(String token) {
        EmailSubscription subscription = emailSubscriptionRepository.findByConfirmationToken(token);
        if (subscription != null && subscription.isConfirmed()) {
            emailSubscriptionRepository.delete(subscription);
            return true;
        }
        return false;
    }

    public void sendDailyForecast() {
        emailService.sendDailyWeatherEmails();
    }
}
