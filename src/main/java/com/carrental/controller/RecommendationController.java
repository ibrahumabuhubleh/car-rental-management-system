package com.carrental.controller;

import com.carrental.model.Car;
import com.carrental.service.RecommendationService;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public List<Car> recommendCars(@RequestParam BigDecimal maxBudgetPerDay,
                                   @RequestParam int passengers,
                                   @RequestParam int durationDays,
                                   @RequestParam(required = false) String weather) {
        return recommendationService.recommendCars(maxBudgetPerDay, passengers, durationDays, weather);
    }
}
