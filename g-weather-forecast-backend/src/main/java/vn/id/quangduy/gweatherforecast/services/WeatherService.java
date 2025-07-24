package vn.id.quangduy.gweatherforecast.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.id.quangduy.gweatherforecast.dto.responses.CurrentResponse;
import vn.id.quangduy.gweatherforecast.dto.responses.ForecastResponse;
import vn.id.quangduy.gweatherforecast.dto.responses.SearchLocation;
import vn.id.quangduy.gweatherforecast.dto.responses.TimezoneResponse;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

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

    public List<SearchLocation> getSearch(String query) {
        String cacheKey = "search:" + query;
        String url = String.format("%s/search.json?key=%s&q=%s", baseUrl, apiKey, query);
        SearchLocation[] results = getApiResponse(cacheKey, url, SearchLocation[].class);
        return Arrays.asList(results);
    }

    public TimezoneResponse getTimezone(String location) {
        String cacheKey = "location:" + location;
        String url = String.format("%s/timezone.json?key=%s&q=%s", baseUrl, apiKey, location);
        return getApiResponse(cacheKey, url, TimezoneResponse.class);
    }

    public CurrentResponse getCurrentWeather(String location) {
        String cacheKey = "currentWeather:" + location;
        String url = String.format("%s/current.json?key=%s&q=%s", baseUrl, apiKey, location);
        return getApiResponse(cacheKey, url, CurrentResponse.class);
    }

    public ForecastResponse getForecast(String location, int days) {
        String cacheKey = "forecastWeather:" + location + ":" + days;
        String url = String.format("%s/forecast.json?key=%s&q=%s&days=%d", baseUrl, apiKey, location, days);
        return getApiResponse(cacheKey, url, ForecastResponse.class);
    }

    // Helper method to handle the common logic
    @SuppressWarnings("unchecked")
    private <T> T getApiResponse(String cacheKey, String url, Class<T> responseType) {
        // Check if the data is in the cache
        T cachedResponse = (T) redisTemplate.opsForValue().get(cacheKey);
        if (cachedResponse != null) {
            return cachedResponse;
        }

        // Fetch from the API if not in cache
        T apiResponse = restTemplate.getForObject(url, responseType);

        // Cache the API response
        redisTemplate.opsForValue().set(cacheKey, apiResponse, Duration.ofMinutes(15));

        return apiResponse;
    }
}
