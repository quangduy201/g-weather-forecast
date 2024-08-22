package vn.id.quangduy.gweatherforecast.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.id.quangduy.gweatherforecast.models.WeatherData;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    List<WeatherData> findByCityAndCountryAndTimestampBetween(String city, String country, LocalDateTime start, LocalDateTime end);
}
