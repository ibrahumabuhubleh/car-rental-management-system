# Car Rental Management System

A Spring Boot backend starter project for the thesis topic: **Car Rental Management System with Smart Decision Support**.

## Features included

- Car CRUD API
- Customer API
- Booking API with availability checking
- Automatic booking price calculation
- Smart recommendation API
- Fleet analytics summary API
- H2 in-memory database for easy development
- PostgreSQL dependency included for later deployment

## Requirements

- Java 17+
- Maven
- IntelliJ IDEA or VS Code

## How to run

```bash
mvn spring-boot:run
```

Then open:

```text
http://localhost:8080
```

H2 database console:

```text
http://localhost:8080/h2-console
```

Use this JDBC URL:

```text
jdbc:h2:mem:carrentaldb
```

Username:

```text
sa
```

Password is empty.

## Example endpoints

### Get all cars

```http
GET http://localhost:8080/api/cars
```

### Add a car

```http
POST http://localhost:8080/api/cars
Content-Type: application/json

{
  "brand": "Kia",
  "model": "Sportage",
  "year": 2022,
  "category": "SUV",
  "fuelType": "Petrol",
  "transmission": "Automatic",
  "seats": 5,
  "pricePerDay": 55,
  "status": "AVAILABLE"
}
```

### Get smart recommendations

```http
GET http://localhost:8080/api/recommendations?maxBudgetPerDay=70&passengers=4&durationDays=5&weather=rain
```

### Analytics summary

```http
GET http://localhost:8080/api/analytics/summary
```

## Next modifications we can add

1. Spring Security + JWT login
2. Admin and staff roles
3. React frontend dashboard
4. Payment endpoints
5. Maintenance endpoints
6. Weather API integration
7. PostgreSQL configuration
8. Thesis report diagrams and screenshots
