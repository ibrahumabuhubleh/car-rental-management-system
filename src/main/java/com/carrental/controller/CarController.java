package com.carrental.controller;

import com.carrental.model.Car;
import com.carrental.service.CarService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "*")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/available")
    public List<Car> getAvailableCars() {
        return carService.getAvailableCars();
    }

    @GetMapping("/{id}")
    public Car getCarById(@PathVariable Long id) {
        return carService.getCarById(id);
    }

    @PostMapping
    public Car createCar(@Valid @RequestBody Car car) {
        return carService.saveCar(car);
    }

    @PutMapping("/{id}")
    public Car updateCar(@PathVariable Long id, @RequestBody Car updatedCar) {

        Car existingCar = carService.getCarById(id);

        existingCar.setBrand(updatedCar.getBrand());
        existingCar.setModel(updatedCar.getModel());
        existingCar.setCategory(updatedCar.getCategory());
        existingCar.setFuelType(updatedCar.getFuelType());
        existingCar.setTransmission(updatedCar.getTransmission());
        existingCar.setYear(updatedCar.getYear());
        existingCar.setSeats(updatedCar.getSeats());
        existingCar.setPricePerDay(updatedCar.getPricePerDay());
        existingCar.setPerformanceScore(updatedCar.getPerformanceScore());
        existingCar.setStatus(updatedCar.getStatus());

        return carService.saveCar(existingCar);
    }

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
    }
}