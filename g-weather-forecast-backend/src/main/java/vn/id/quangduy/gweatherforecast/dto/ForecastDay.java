package vn.id.quangduy.gweatherforecast.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ForecastDay implements Serializable {
    private String date;
    private Long date_epoch;
    private Day day;
    private Astro astro;
    private List<Hour> hour;
}
