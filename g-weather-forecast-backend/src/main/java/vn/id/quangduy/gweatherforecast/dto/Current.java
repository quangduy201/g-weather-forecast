package vn.id.quangduy.gweatherforecast.dto;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Current extends WeatherBase implements Serializable {
    private long last_updated_epoch;
    private String last_updated;
}
