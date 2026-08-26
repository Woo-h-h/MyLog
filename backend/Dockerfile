FROM docker.m.daocloud.io/library/eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn
COPY src src
RUN chmod +x mvnw && ./mvnw -q -DskipTests package

FROM docker.m.daocloud.io/library/eclipse-temurin:21-jre
WORKDIR /app
RUN mkdir -p /app/uploads/resume /app/data
COPY --from=build /workspace/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar","--spring.profiles.active=docker"]
