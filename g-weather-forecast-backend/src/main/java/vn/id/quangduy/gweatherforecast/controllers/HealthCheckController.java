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

    @GetMapping("/postgres")
    public ResponseEntity<String> checkPostgres() {
        try {
            jdbcTemplate.execute("SELECT 1");
            return new ResponseEntity<>("PostgreSQL is UP", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("PostgreSQL is DOWN", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @GetMapping("/redis")
    public ResponseEntity<String> checkRedis() {
        try {
            redisConnectionFactory.getConnection().ping();
            return new ResponseEntity<>("Redis is UP", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Redis is DOWN", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @GetMapping("/mail")
    public ResponseEntity<String> checkMailSender() {
        try {
            mailSender.createMimeMessage();
            return new ResponseEntity<>("MailSender is UP", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("MailSender is DOWN", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
