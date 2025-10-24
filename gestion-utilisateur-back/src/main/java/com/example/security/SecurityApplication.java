package com.example.security;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class SecurityApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(SecurityApplication.class);

        // 🔹 Charge .env AVANT Spring Boot
        app.addInitializers((ApplicationContextInitializer<ConfigurableApplicationContext>) ctx -> {
            Dotenv dotenv = Dotenv.load();
            dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        });

        app.run(args);
    }
}
