FROM maven:3.9.6-eclipse-temurin-22

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/car-rental-management-system-0.0.1-SNAPSHOT.jar"]