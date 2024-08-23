package vn.id.quangduy.gweatherforecast.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.id.quangduy.gweatherforecast.dto.requests.RegisterRequest;
import vn.id.quangduy.gweatherforecast.dto.requests.UnsubscribeRequest;
import vn.id.quangduy.gweatherforecast.services.EmailSubscriptionService;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    @Value("${frontend.baseurl}")
    private String frontendUrl;

    private final EmailSubscriptionService emailSubscriptionService;

    @Autowired
    public SubscriptionController(EmailSubscriptionService emailSubscriptionService) {
        this.emailSubscriptionService = emailSubscriptionService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        emailSubscriptionService.register(request.getEmail(), request.getCoordinates());
        return ResponseEntity.ok("Confirmation email sent. Please check your inbox.");
    }

    @GetMapping("/confirm-subscription")
    public ResponseEntity<String> confirmSubscription(@RequestParam String token) {
        boolean isConfirmed = emailSubscriptionService.confirmSubscription(token);
        if (isConfirmed) {
            String message = "Subscription confirmed! You will receive daily weather updates." +
                    "<br><br><a href=\"" + frontendUrl + "\">Go to the app</a>";
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.badRequest().body("Invalid token or already confirmed.");
        }
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribe(@RequestBody UnsubscribeRequest request) {
        emailSubscriptionService.unsubscribe(request.getEmail());
        return ResponseEntity.ok("Unsubscription email sent. Please check your inbox.");
    }

    @GetMapping("/confirm-unsubscription")
    public ResponseEntity<String> confirmUnsubscription(@RequestParam String token) {
        boolean isUnsubscribed = emailSubscriptionService.confirmUnsubscription(token);
        if (isUnsubscribed) {
            return ResponseEntity.ok("Unsubscription confirmed! You will no longer receive daily weather updates.");
        } else {
            return ResponseEntity.badRequest().body("Invalid token or already unsubscribed.");
        }
    }
}
