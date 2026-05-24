package com.carrental.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/api/test")
    public String testApi() {
        return "Backend is working successfully!";
    }
}
