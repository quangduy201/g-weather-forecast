package vn.id.quangduy.gweatherforecast.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "email_subscription")
public class EmailSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    private String location;

    private String coordinates;

    @Column(nullable = false)
    private String timezone;

    @Column(nullable = false)
    private String notificationTime;

    @Column(nullable = false)
    private String notificationUtcTime;

    private boolean confirmed;

    private String confirmationToken;

    private LocalDateTime lastSentAt;

    public EmailSubscription(String email, String location, String coordinates, String timezone, String notificationTime, boolean confirmed, String confirmationToken, LocalDateTime lastSentAt) {
        this.email = email;
        this.location = location;
        this.coordinates = coordinates;
        this.timezone = timezone;
        this.notificationTime = notificationTime;
        this.confirmed = confirmed;
        this.confirmationToken = confirmationToken;
        this.lastSentAt = lastSentAt;
    }
}
