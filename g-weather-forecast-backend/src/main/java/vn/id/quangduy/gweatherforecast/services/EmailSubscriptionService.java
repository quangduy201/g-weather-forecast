package vn.id.quangduy.gweatherforecast.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.id.quangduy.gweatherforecast.dto.Location;
import vn.id.quangduy.gweatherforecast.models.EmailSubscription;
import vn.id.quangduy.gweatherforecast.repositories.EmailSubscriptionRepository;
import vn.id.quangduy.gweatherforecast.utils.TimezoneUtils;

import java.util.UUID;

@Service
public class EmailSubscriptionService {

    private final EmailSubscriptionRepository emailSubscriptionRepository;
    private final EmailService emailService;
    private final WeatherService weatherService;

    @Autowired
    public EmailSubscriptionService(EmailSubscriptionRepository emailSubscriptionRepository, EmailService emailService, WeatherService weatherService) {
        this.emailSubscriptionRepository = emailSubscriptionRepository;
        this.emailService = emailService;
        this.weatherService = weatherService;
    }

    @Transactional
    public void register(String email, String coordinates) {
        String token = UUID.randomUUID().toString();
        Location location = weatherService.getTimezone(coordinates).getLocation();
        double doubleTimezoneOffset = TimezoneUtils.convertTimezoneToDouble(location.getTz_id());
        EmailSubscription subscription = new EmailSubscription(email, location.getName(), doubleTimezoneOffset, false, token);
        emailSubscriptionRepository.save(subscription);

        // Send confirmation email
        emailService.sendConfirmationEmail(email, location.getName(), token);
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
}
