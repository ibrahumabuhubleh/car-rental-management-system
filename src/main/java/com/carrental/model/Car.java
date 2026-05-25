package com.carrental.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @NotBlank
    private String category;

    @NotBlank
    private String fuelType;

    @NotBlank
    private String transmission;

    @NotNull
    @Min(1990)
    @Column(name = "car_year")
    private Integer year;

    @NotNull
    private BigDecimal pricePerDay;

    @NotNull
    @Min(1)
    private Integer seats;

    @NotNull
    private Double performanceScore;

    @Enumerated(EnumType.STRING)
    private CarStatus status;

    public Car() {
    }

    public Car(String brand, String model, Integer year, String category,
               String fuelType, String transmission, Integer seats,
               BigDecimal pricePerDay, CarStatus status) {
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.category = category;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.seats = seats;
        this.pricePerDay = pricePerDay;
        this.status = status;
        this.performanceScore = 80.0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getTransmission() {
        return transmission;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public BigDecimal getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(BigDecimal pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public Double getPerformanceScore() {
        return performanceScore;
    }

    public void setPerformanceScore(Double performanceScore) {
        this.performanceScore = performanceScore;
    }

    public CarStatus getStatus() {
        return status;
    }

    public void setStatus(CarStatus status) {
        this.status = status;
    }
}