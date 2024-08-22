package vn.id.quangduy.gweatherforecast.models;

import jakarta.persistence.*;
import lombok.*;

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
    private String email;
    private String location;
    private boolean confirmed;
    private String confirmationToken;

    public EmailSubscription(String email, String location, boolean confirmed, String confirmationToken) {
        this.email = email;
        this.location = location;
        this.confirmed = confirmed;
        this.confirmationToken = confirmationToken;
    }
}
