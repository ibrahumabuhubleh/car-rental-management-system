package com.carrental.controller;

import com.carrental.service.FleetAnalyticsService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    private final FleetAnalyticsService fleetAnalyticsService;

    public AnalyticsController(FleetAnalyticsService fleetAnalyticsService) {
        this.fleetAnalyticsService = fleetAnalyticsService;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        return fleetAnalyticsService.getDashboardSummary();
    }
}
