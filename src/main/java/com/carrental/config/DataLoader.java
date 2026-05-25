package com.carrental.config;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.model.Customer;
import com.carrental.repository.CarRepository;
import com.carrental.repository.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(CarRepository carRepository, CustomerRepository customerRepository) {
        return args -> {
            if (carRepository.count() == 0) {
                carRepository.save(new Car("Toyota", "Corolla", 2022, "Economy", "Hybrid", "Automatic", 5, new BigDecimal("35"), CarStatus.AVAILABLE));
                carRepository.save(new Car("Hyundai", "Tucson", 2023, "SUV", "Petrol", "Automatic", 5, new BigDecimal("60"), CarStatus.AVAILABLE));
                carRepository.save(new Car("Mercedes", "C-Class", 2021, "Luxury", "Petrol", "Automatic", 5, new BigDecimal("95"), CarStatus.AVAILABLE));
            }

            if (customerRepository.count() == 0) {
                customerRepository.save(new Customer("Test Customer", "+962700000000", "customer@example.com", "LIC12345", "Amman"));
            }
        };
    }
}