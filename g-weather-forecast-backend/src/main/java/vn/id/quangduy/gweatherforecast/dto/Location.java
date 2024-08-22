package vn.id.quangduy.gweatherforecast.dto;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Location implements Serializable {
    private String name;
    private String region;
    private String country;
    private double lat;
    private double lon;
    private String tz_id;
    private Long localtime_epoch;
    private String localtime;
}
