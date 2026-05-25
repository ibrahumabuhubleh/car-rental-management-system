package com.carrental.controller;

import com.carrental.model.MaintenanceRecord;
import com.carrental.service.MaintenanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public List<MaintenanceRecord> getAllRecords() {
        return maintenanceService.getAllMaintenanceRecords();
    }

    @PostMapping
    public MaintenanceRecord createRecord(
            @RequestParam Long carId,
            @RequestBody MaintenanceRecord record
    ) {
        return maintenanceService.createMaintenanceRecord(carId, record);
    }
}