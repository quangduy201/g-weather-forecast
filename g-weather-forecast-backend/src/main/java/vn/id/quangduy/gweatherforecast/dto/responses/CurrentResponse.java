package vn.id.quangduy.gweatherforecast.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.id.quangduy.gweatherforecast.dto.Current;
import vn.id.quangduy.gweatherforecast.dto.Location;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CurrentResponse implements Serializable {
    private Location location;
    private Current current;
}
