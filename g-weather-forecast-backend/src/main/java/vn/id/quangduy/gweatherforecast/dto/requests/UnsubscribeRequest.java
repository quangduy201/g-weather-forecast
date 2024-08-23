package vn.id.quangduy.gweatherforecast.dto.requests;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UnsubscribeRequest implements Serializable {
    private String email;
}
