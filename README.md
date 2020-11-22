<p align="center">
<img src="https://www.metaltoad.com/sites/default/files/styles/large_personal_photo_870x500_/public/2020-05/react-js-blog-header.png" height="158">
<img src="https://atomrace.com/blog/wp-content/uploads/2018/05/spring-boot-logo-300x158.png" height="150">
</p>

# Messenger project : real time chat with ReactJS and Spring Boot

This web application is a project that I made myself to practice in Java and ReactJS. Please do not hesitate to contact me if you see any errors (small or big).

#### Project Requirements

- JDK 8
- NodeJS
- MySQL Server

#### Project set up

- This project use [liquibase](https://www.liquibase.org/) as a version control for database. When you will start backend, all tables and structures will be generated automatically.
- To try the project on localhost, check that nothing runs on ports 9090 (Spring Boot) and 3000 (React app)
- You can edit ````spring.datasource```` in ```backend/src/main/resources/application.properties```  and ```username``` and ```password``` in ```backend/src/main/resources/liquibase.properties``` with your own SQL login / password 
- Create a database named "websocket" or you can also modify the name in the properties files mentioned just above.

##### Start server
- Go inside backend folder then type  ```mvn spring-boot:run``` to launch backend.
- Or you can type ```mvn clean package``` to generate a JAR file and then start server with ```java -jar path/to/jar/file``` (Normally in inside backend/target/) 
##### Start frontend
- Go inside frontend-web folder and then type ```npm react-scripts start```

## Features

![Project overview](src/main/resources/sample/messenger.jpg?raw=true "Project overview")

* Simple chat group application based on websocket
* Secure user account based on Spring Security JWT
* Room discussion with STOMP and SockJS
* Chat group administrators
* Add / remove users from conversation 
* Dark / Light Mode