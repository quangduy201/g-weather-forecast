package vn.id.quangduy.gweatherforecast.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    private final JdbcTemplate jdbcTemplate;
    private final RedisConnectionFactory redisConnectionFactory;
    private final JavaMailSender mailSender;

    @Autowired
    public HealthCheckController(JdbcTemplate jdbcTemplate, RedisConnectionFactory redisConnectionFactory, JavaMailSender mailSender) {
        this.jdbcTemplate = jdbcTemplate;
        this.redisConnectionFactory = redisConnectionFactory;
        this.mailSender = mailSender;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> healthStatus = new HashMap<>();
        HttpStatus status = HttpStatus.OK;

        // Check PostgreSQL
        try {
            jdbcTemplate.execute("SELECT 1");
            healthStatus.put("db", "UP");
        } catch (Exception e) {
            healthStatus.put("db", "DOWN");
            status = HttpStatus.SERVICE_UNAVAILABLE;
        }

        // Check Redis
        try {
            redisConnectionFactory.getConnection().ping();
            healthStatus.put("redis", "UP");
        } catch (Exception e) {
            healthStatus.put("redis", "DOWN");
            status = HttpStatus.SERVICE_UNAVAILABLE;
        }

        // Check MailSender
        try {
            mailSender.createMimeMessage();
            healthStatus.put("mail", "UP");
        } catch (Exception e) {
            healthStatus.put("mail", "DOWN");
            status = HttpStatus.SERVICE_UNAVAILABLE;
        }

        return new ResponseEntity<>(healthStatus, status);
    }
}
