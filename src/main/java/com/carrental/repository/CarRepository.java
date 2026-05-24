package com.carrental.repository;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByStatus(CarStatus status);
}
