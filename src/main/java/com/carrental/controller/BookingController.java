package com.carrental.controller;

import com.carrental.model.Booking;
import com.carrental.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping
    public Booking createBooking(@RequestParam Long carId,
                                 @RequestParam Long customerId,
                                 @Valid @RequestBody Booking booking) {
        return bookingService.createBooking(carId, customerId, booking);
    }
}
