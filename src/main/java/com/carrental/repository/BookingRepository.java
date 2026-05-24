package com.carrental.repository;

import com.carrental.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b WHERE b.car.id = :carId AND b.status <> 'CANCELLED' AND " +
           "(:startDate <= b.endDate AND :endDate >= b.startDate)")
    List<Booking> findOverlappingBookings(@Param("carId") Long carId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);
}
