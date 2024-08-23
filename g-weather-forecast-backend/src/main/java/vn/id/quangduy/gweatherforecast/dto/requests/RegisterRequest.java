package vn.id.quangduy.gweatherforecast.dto.requests;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RegisterRequest implements Serializable {
    private String email;
    private String coordinates;
}
