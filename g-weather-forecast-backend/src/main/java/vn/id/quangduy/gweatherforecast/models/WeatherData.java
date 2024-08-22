package vn.id.quangduy.gweatherforecast.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "weather_data")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String city;
    private String country;
    private double temperature;
    private double windSpeed;
    private int humidity;
    private LocalDateTime timestamp;
    private String text;
    private String icon;
}
