package vn.id.quangduy.gweatherforecast.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import vn.id.quangduy.gweatherforecast.dto.responses.CurrentResponse;
import vn.id.quangduy.gweatherforecast.dto.responses.ForecastResponse;
import vn.id.quangduy.gweatherforecast.services.WeatherService;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/current")
    public ResponseEntity<CurrentResponse> getCurrentWeather(@RequestParam String location) {
        try {
            CurrentResponse currentResponse = weatherService.getCurrentWeather(location);
            return ResponseEntity.ok(currentResponse);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }

    @GetMapping("/forecast")
    public ResponseEntity<ForecastResponse> getForecast(@RequestParam String location, @RequestParam int days) {
        try {
            ForecastResponse forecastResponse = weatherService.getForecast(location, days);
            return ResponseEntity.ok(forecastResponse);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }
}
