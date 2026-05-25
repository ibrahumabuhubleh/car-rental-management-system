package com.carrental.service;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.model.MaintenanceRecord;
import com.carrental.repository.CarRepository;
import com.carrental.repository.MaintenanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final CarRepository carRepository;

    public MaintenanceService(MaintenanceRepository maintenanceRepository,
                              CarRepository carRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.carRepository = carRepository;
    }

    public List<MaintenanceRecord> getAllMaintenanceRecords() {
        return maintenanceRepository.findAll();
    }

    public MaintenanceRecord createMaintenanceRecord(Long carId, MaintenanceRecord record) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        car.setStatus(CarStatus.MAINTENANCE);
        carRepository.save(car);

        record.setCar(car);

        return maintenanceRepository.save(record);
    }
}