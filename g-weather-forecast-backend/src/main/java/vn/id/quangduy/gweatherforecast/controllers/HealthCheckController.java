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
    public ResponseEntity<String> checkHealth() {
        StringBuilder statusMessage = new StringBuilder("Health Check Results:\n");
        HttpStatus status = HttpStatus.OK;

        // Check PostgreSQL
        try {
            jdbcTemplate.execute("SELECT 1");
            statusMessage.append("PostgreSQL is UP\n");
        } catch (Exception e) {
            statusMessage.append("PostgreSQL is DOWN\n");
            status = HttpStatus.SERVICE_UNAVAILABLE;
        }

        // Check Redis
        try {
            redisConnectionFactory.getConnection().ping();
            statusMessage.append("Redis is UP\n");
        } catch (Exception e) {
            statusMessage.append("Redis is DOWN\n");
            status = HttpStatus.SERVICE_UNAVAILABLE;
        }

        // Check MailSender
        try {
            mailSender.createMimeMessage();
            statusMessage.append("MailSender is UP\n");
        } catch (Exception e) {
            statusMessage.append("MailSender is DOWN\n");
            status = HttpStatus.SERVICE_UNAVAILABLE;
        }

        return new ResponseEntity<>(statusMessage.toString(), status);
    }
}
