# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-jammy AS builder
ENV HOME=/usr/app
WORKDIR $HOME
ADD . $HOME
RUN --mount=type=cache,target=/root/.m2 ./mvnw -f $HOME/pom.xml clean package

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-jammy
ARG JAR_FILE=/usr/app/target/*.jar
COPY --from=builder $JAR_FILE application.jar
ENTRYPOINT ["java", "-jar", "application.jar"]
