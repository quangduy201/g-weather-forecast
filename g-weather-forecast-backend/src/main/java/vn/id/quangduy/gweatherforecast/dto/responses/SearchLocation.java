package vn.id.quangduy.gweatherforecast.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class SearchLocation implements Serializable {
    private Long id;
    private String name;
    private String region;
    private String country;
    private double lat;
    private double lon;
    private String url;
}
