package com.carrental.repository;

import com.carrental.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import com.carrental.model.CarStatus;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {

    List<Car> findByStatus(CarStatus status);
}