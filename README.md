<div align="center">

   ![React logo](assets/react.png "React logo")
   ![Spring Boot logo](assets/springboot.png "Sprint boot logo")
   <img src="https://miro.medium.com/max/1400/1*MbZY_t47eV_ZMATRT-q_LQ.jpeg" height="100">
</div>

# Messenger project : real time chat with React and Spring Boot

Real time chat application group oriented. Talk with your friends, create and add users to conversation, set groups administrators!

## Start-up :

#### Project Requirements

- JDK 8
- NodeJS
- MySQL Server
- NGINX Server (optional)

#### Project set up

- This project use [liquibase](https://www.liquibase.org/) as a version control for database. When you will start backend, all tables and structures will be generated automatically.
- To try the project on localhost, check that nothing runs on ports 9090 (Spring Boot) and 3000 (React app)
- You can edit ````spring.datasource```` in ```backend/src/main/resources/application.properties```  and ```username``` and ```password``` in ```backend/src/main/resources/liquibase.properties``` with your own SQL login / password, and SMTP sever credentials
- Create a database named "websocket" or you can also modify the name in the properties files mentioned just above.
- To run application on HTTPS it is required to install NGINX, build the fronted application with ```npm run build```, edit file ```reverse-proxy/default``` (it is necessary to set path for certificate, key pair and path to frontend build folder), copy file to default NGINX folder ```sudo cp default /etc/nginx/sites-enabled/default``` and run server with ```sudo service nginx start```. After that,the application will be accessible on port 443 (make sure to run backend application first).
- Preferably, add the following line to ```/etc/hosts```: ```127.0.0.1 chat.example.com login.chat.example.com```, if you don't want to use raw IP address in your browser, and the application will be accessible on URL ```https://chat.example.com```.

To start the application without HTTPS, just take the following steps
 
##### Start server
- Go inside backend folder then type  ```mvn spring-boot:run``` to launch backend.
- Or you can type ```mvn clean package``` to generate a JAR file and then start server with ```java -jar path/to/jar/file``` (Normally in inside backend/target/) 
##### Start frontend
- Go inside frontend-web folder and then type ```npm react-scripts start```

# Project overview

![Project overview](assets/messenger.jpg?raw=true "Project overview")

* Simple chat group application based on websocket
* Secure user account based on Spring Security JWT
* HTTPS support
* Room discussion with STOMP and SockJS
* Add / remove users from conversation 
* Dark / Light Mode
