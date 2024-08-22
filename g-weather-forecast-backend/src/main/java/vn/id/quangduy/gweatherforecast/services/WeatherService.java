package vn.id.quangduy.gweatherforecast.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.id.quangduy.gweatherforecast.dto.responses.ForecastResponse;
import vn.id.quangduy.gweatherforecast.dto.responses.CurrentResponse;

import java.time.Duration;

@Service
public class WeatherService {

    @Value("${weatherapi.key}")
    private String apiKey;

    @Value("${weatherapi.baseurl}")
    private String baseUrl;

    private final RedisTemplate<String, Object> redisTemplate;
    private final RestTemplate restTemplate;

    @Autowired
    public WeatherService(RestTemplateBuilder builder, RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.restTemplate = builder.build();
    }

    public CurrentResponse getCurrentWeather(String location) {
        String cacheKey = "currentWeather:" + location;

        // Check if the data is in the cache
        CurrentResponse cachedResponse = (CurrentResponse) redisTemplate.opsForValue().get(cacheKey);
        if (cachedResponse != null) {
            return cachedResponse;
        }

        // Fetch from the API if not in cache
        String url = String.format("%s/current.json?key=%s&q=%s", baseUrl, apiKey, location);
        CurrentResponse apiResponse = restTemplate.getForObject(url, CurrentResponse.class);

        // Cache the API response
        redisTemplate.opsForValue().set(cacheKey, apiResponse, Duration.ofHours(1));

        return apiResponse;
    }

    public ForecastResponse getForecast(String location, int days) {
        String cacheKey = "forecastWeather:" + location + ":" + days;

        // Check if the data is in the cache
        ForecastResponse cachedResponse = (ForecastResponse) redisTemplate.opsForValue().get(cacheKey);
        if (cachedResponse != null) {
            return cachedResponse;
        }

        // Fetch from the API if not in cache
        String url = String.format("%s/forecast.json?key=%s&q=%s&days=%d", baseUrl, apiKey, location, days);
        ForecastResponse apiResponse = restTemplate.getForObject(url, ForecastResponse.class);

        // Cache the API response
        redisTemplate.opsForValue().set(cacheKey, apiResponse, Duration.ofHours(1));

        return apiResponse;
    }
}
