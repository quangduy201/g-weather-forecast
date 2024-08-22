package vn.id.quangduy.gweatherforecast.dto.responses;

import lombok.*;
import vn.id.quangduy.gweatherforecast.dto.Current;
import vn.id.quangduy.gweatherforecast.dto.ForecastDay;
import vn.id.quangduy.gweatherforecast.dto.Location;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ForecastResponse implements Serializable {
    private Location location;
    private Current current;
    private Forecast forecast;

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    @Builder
    public static class Forecast implements Serializable {
        private List<ForecastDay> forecastday;
    }
}
