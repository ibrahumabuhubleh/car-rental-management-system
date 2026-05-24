package com.carrental.service;

import com.carrental.model.Car;
import com.carrental.repository.CarRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FleetAnalyticsService {
    private final CarRepository carRepository;

    public FleetAnalyticsService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public Map<String, Object> getDashboardSummary() {
        List<Car> cars = carRepository.findAll();
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalCars", cars.size());
        summary.put("availableCars", cars.stream().filter(c -> c.getStatus().name().equals("AVAILABLE")).count());
        summary.put("rentedCars", cars.stream().filter(c -> c.getStatus().name().equals("RENTED")).count());
        summary.put("maintenanceCars", cars.stream().filter(c -> c.getStatus().name().equals("MAINTENANCE")).count());
        return summary;
    }
}
