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

                carRepository.save(new Car(
                        "Mercedes",
                        "AMG GT",
                        2024,
                        "Sports Luxury",
                        "Petrol",
                        "Automatic",
                        2,
                        new BigDecimal("220"),
                        CarStatus.AVAILABLE
                ));

                carRepository.save(new Car(
                        "BMW",
                        "X5",
                        2023,
                        "Luxury SUV",
                        "Hybrid",
                        "Automatic",
                        5,
                        new BigDecimal("160"),
                        CarStatus.AVAILABLE
                ));

                carRepository.save(new Car(
                        "Range Rover",
                        "Velar",
                        2024,
                        "Luxury SUV",
                        "Petrol",
                        "Automatic",
                        5,
                        new BigDecimal("240"),
                        CarStatus.AVAILABLE
                ));

                carRepository.save(new Car(
                        "Porsche",
                        "911 Carrera",
                        2024,
                        "Sports",
                        "Petrol",
                        "Automatic",
                        2,
                        new BigDecimal("300"),
                        CarStatus.AVAILABLE
                ));

                carRepository.save(new Car(
                        "Tesla",
                        "Model S",
                        2023,
                        "Electric Luxury",
                        "Electric",
                        "Automatic",
                        5,
                        new BigDecimal("180"),
                        CarStatus.AVAILABLE
                ));

                carRepository.save(new Car(
                        "Audi",
                        "A6",
                        2022,
                        "Executive",
                        "Petrol",
                        "Automatic",
                        5,
                        new BigDecimal("140"),
                        CarStatus.AVAILABLE
                ));

                carRepository.save(new Car(
                        "Toyota",
                        "Corolla",
                        2022,
                        "Economy",
                        "Hybrid",
                        "Automatic",
                        5,
                        new BigDecimal("45"),
                        CarStatus.AVAILABLE
                ));

                carRepository.save(new Car(
                        "Hyundai",
                        "Tucson",
                        2023,
                        "SUV",
                        "Petrol",
                        "Automatic",
                        5,
                        new BigDecimal("75"),
                        CarStatus.AVAILABLE
                ));
            }

            if (customerRepository.count() == 0) {

                customerRepository.save(
                        new Customer(
                                "Test Customer",
                                "+962700000000",
                                "customer@example.com",
                                "LIC12345",
                                "Amman"
                        )
                );
            }
        };
    }
}