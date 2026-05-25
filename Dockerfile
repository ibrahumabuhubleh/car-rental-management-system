FROM eclipse-temurin:22-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/car-rental-management-system-0.0.1-SNAPSHOT.jar"]