package vn.id.quangduy.gweatherforecast.controllers;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import vn.id.quangduy.gweatherforecast.dto.requests.RegisterRequest;
import vn.id.quangduy.gweatherforecast.dto.requests.UnsubscribeRequest;
import vn.id.quangduy.gweatherforecast.services.EmailSubscriptionService;

import java.io.IOException;

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
        try {
            emailSubscriptionService.register(request.getEmail(), request.getLocation());
            return ResponseEntity.ok("Confirmation email sent. Please check your inbox.");
        } catch(HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }

    @GetMapping("/confirm-subscription")
    public void confirmSubscription(@RequestParam String token, HttpServletResponse response) throws IOException {
        boolean isConfirmed = emailSubscriptionService.confirmSubscription(token);
        if (isConfirmed) {
//            String message = "Subscription confirmed! You will receive daily weather updates." +
//                    "<br><br><a href=\"" + frontendUrl + "\">Go to the app</a>";
//            return ResponseEntity.ok(message);
            response.sendRedirect(frontendUrl + "/subscribe-success");
        } else {
//            return ResponseEntity.badRequest().body("Invalid token or already confirmed.");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid token or already confirmed.");
        }
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<String> unsubscribe(@RequestBody UnsubscribeRequest request) {
        try {
            emailSubscriptionService.unsubscribe(request.getEmail());
        } catch(HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
        return ResponseEntity.ok("Unsubscription email sent. Please check your inbox.");
    }

    @GetMapping("/confirm-unsubscription")
    public void confirmUnsubscription(@RequestParam String token, HttpServletResponse response) throws IOException {
        boolean isUnsubscribed = emailSubscriptionService.confirmUnsubscription(token);
        if (isUnsubscribed) {
//            return ResponseEntity.ok("Unsubscription confirmed! You will no longer receive daily weather updates.");
            response.sendRedirect(frontendUrl + "/subscribe-success");
        } else {
//            return ResponseEntity.badRequest().body("Invalid token or already unsubscribed.");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid token or already confirmed.");
        }
    }
}
