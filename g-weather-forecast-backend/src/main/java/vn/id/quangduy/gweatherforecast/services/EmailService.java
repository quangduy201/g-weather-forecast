package vn.id.quangduy.gweatherforecast.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.id.quangduy.gweatherforecast.dto.ForecastDay;
import vn.id.quangduy.gweatherforecast.dto.responses.ForecastResponse;
import vn.id.quangduy.gweatherforecast.models.EmailSubscription;
import vn.id.quangduy.gweatherforecast.repositories.EmailSubscriptionRepository;
import vn.id.quangduy.gweatherforecast.utils.TimezoneUtils;

import java.util.List;

@Service
public class EmailService {

    @Value("${spring.mail.username}")
    private String from;

    @Value("${backend.baseurl}")
    private String backendUrl;

    @Value("${frontend.baseurl}")
    private String frontendUrl;

    private final static int DAILY_HOUR = 7;

    private final JavaMailSender mailSender;
    private final EmailSubscriptionRepository subscriptionRepository;
    private final WeatherService weatherService;

    @Autowired
    public EmailService(JavaMailSender mailSender, EmailSubscriptionRepository subscriptionRepository, WeatherService weatherService) {
        this.mailSender = mailSender;
        this.subscriptionRepository = subscriptionRepository;
        this.weatherService = weatherService;
    }

    @Scheduled(cron = "0 0,15,30,45 * * * *") // Runs every hour at 0, 15, 30, 45 minutes
    public void sendDailyForecastEmails() {
        // Find the timezone offset where it is currently 7AM
        double clientOffset = TimezoneUtils.getClientTimezoneOffsetAt(DAILY_HOUR);
        List<EmailSubscription> subscriptions = subscriptionRepository.findByTimezoneOffsetAndConfirmed(clientOffset, true);
        for (EmailSubscription subscription : subscriptions) {
            String location = subscription.getLocation();
            ForecastResponse forecast = weatherService.getForecast(location, 1); // Get forecast for the current day
            ForecastDay forecastDay = forecast.getForecast().getForecastday().get(0);

            String subject = "Daily Weather Forecast (" + forecastDay.getDate() + ")";
            String unsubscriptionUrl = frontendUrl + "/unsubscription-confirm?token=" + subscription.getConfirmationToken();
            String message = "<h1>Location: " + forecast.getLocation().getName() + "</h1>" +
                    "<img src=\"https:" + forecastDay.getDay().getCondition().getIcon() + "\" />" +
                    "<h2>" + forecastDay.getDay().getCondition().getText() + "</h2>" +
                    "<p>Average temperature: " + forecastDay.getDay().getAvgtemp_c() + "°C</p>" +
                    "<p>Max wind: " + String.format("%.2f", forecastDay.getDay().getMaxwind_kph() / 3.6) + " M/S</p>" +
                    "<p>Average humidity: " + forecastDay.getDay().getAvghumidity() + "%</p>" +
                    "<hr>" +
                    "<p>Have a great day!</p>" +
                    "<p>If you wish to unsubscribe from these emails, click <a href=\"" + unsubscriptionUrl + "\">here</a>.</p>";

            sendEmail(subscription.getEmail(), subject, message);
        }
    }

    public void sendConfirmationEmail(String email, String location, String token) {
        String subject = "Confirm Your Subscription";
        String confirmationUrl = frontendUrl + "/subscription-confirm?token=" + token;
        String message = "<p>Thank you for registering to receive daily weather forecasts. We have received your location: " + location + ".</p>"
                + "<p>Your daily weather forecast will be delivered to your inbox at " + DAILY_HOUR + " AM every day, helping you plan your day with the latest information.</p>"
                + "<p>Please click the link below to confirm your subscription:</p>"
                + "<a href=\"" + confirmationUrl + "\">Confirm Subscription</a>";

        sendEmail(email, subject, message);
    }

    public void sendUnsubscriptionEmail(String email, String token) {
        String subject = "Confirm Your Unsubscription";
        String unsubscriptionUrl = frontendUrl + "/unsubscription-confirm?token=" + token;
        String message = "<p>You have requested to unsubscribe from daily weather forecasts. Please click the link below to confirm your unsubscription:</p>"
                + "<a href=\"" + unsubscriptionUrl + "\">Confirm Unsubscription</a>";

        sendEmail(email, subject, message);
    }

    @Async
    public void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // Handle exception
        }
    }
}
