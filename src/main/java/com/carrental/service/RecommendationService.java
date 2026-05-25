package com.carrental.service;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationService {

    private final CarRepository carRepository;

    public RecommendationService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> recommendCars(BigDecimal maxBudgetPerDay, int passengers, int durationDays, String weather) {
        return carRepository.findByStatus(CarStatus.AVAILABLE)
                .stream()
                .filter(car -> car.getPricePerDay().compareTo(maxBudgetPerDay) <= 0)
                .filter(car -> car.getSeats() >= passengers)
                .sorted(Comparator.comparingDouble(car -> -calculateScore(car, durationDays, weather)))
                .toList();
    }

    private double calculateScore(Car car, int durationDays, String weather) {
        double score = 50;

        if (car.getCategory().equalsIgnoreCase("Economy")) {
            score += 10;
        }

        if (durationDays >= 7 && car.getFuelType().equalsIgnoreCase("Hybrid")) {
            score += 20;
        }

        if (weather != null
                && weather.toLowerCase().contains("rain")
                && car.getCategory().equalsIgnoreCase("SUV")) {
            score += 25;
        }

        if (car.getTransmission().equalsIgnoreCase("Automatic")) {
            score += 5;
        }

        score += car.getPerformanceScore();

        return score;
    }
}