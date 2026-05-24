package com.carrental.service;

import com.carrental.model.*;
import com.carrental.repository.BookingRepository;
import com.carrental.repository.CarRepository;
import com.carrental.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final CustomerRepository customerRepository;

    public BookingService(BookingRepository bookingRepository, CarRepository carRepository, CustomerRepository customerRepository) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
        this.customerRepository = customerRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking createBooking(Long carId, Long customerId, Booking booking) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (car.getStatus() != CarStatus.AVAILABLE) {
            throw new RuntimeException("Car is not available");
        }

        boolean hasOverlap = !bookingRepository
                .findOverlappingBookings(carId, booking.getStartDate(), booking.getEndDate())
                .isEmpty();

        if (hasOverlap) {
            throw new RuntimeException("Car is already booked during this period");
        }

        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1;
        if (days <= 0) {
            throw new RuntimeException("End date must be after start date");
        }

        booking.setCar(car);
        booking.setCustomer(customer);
        booking.setTotalPrice(car.getPricePerDay().multiply(BigDecimal.valueOf(days)));
        booking.setStatus(BookingStatus.CONFIRMED);
        car.setStatus(CarStatus.RENTED);
        carRepository.save(car);

        return bookingRepository.save(booking);
    }
}
