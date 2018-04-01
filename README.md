# Kayak Frontend

This repository along with two other repositories - [NodeJS Backend](https://github.com/niyatpatel23295/kayak-backend) and [React Frontend](https://github.com/niyatpatel23295/kayak-frontend) makes whole project a prototype of one of the most famous flights and hotels meta search engine KAYAK. Kayak Prototype is a web based application developed in industry favorite MERN stack (Mongodb, ExpressJS, ReactJS and Node JS). The application provides its users to leverage high performance and reliable online web portal to book hotel rooms, flight tickets and even rent car. This highly efficient system is robust in performance due to its architecture based on Kafka Messaging queue services and highly optimized database systems designed in mind to provide maximum compatibility to the needs and performance. The database architecture is a unique combination of structured and unstructured type of data storage system where MySQL efficiently holds the structured data of hotels, flights and cars details and MongoDB stores unstructured transactions and User logging data. The application offers a secure online transaction process and authentication system using PassportJS and encryption algorithms. 

The Portal comes with a fully-fledged Admin site maintenance system offering a highly interactive GUI to the admin. The admin can access data records for user, hotels, cars and flights along with adding and updating them. The Admin can also leverage the GUI for monitoring the Analysis of user interaction of the system with customized Graph visuals.


## Deliverables

### Project deliverables were composed of the following components:

#### User
  * Flights Search Module
  * Holets Search Module
  * Car Rental Search Module
#### Admin
  * Admin Dashboard 1 - with Create and/or Change existing Flights, Hotels and Cars
  * Admin Dashboard 2 - Analysis and reporting selling of different services
  * Admin Dashboard 3 - User's interaction analytics - User's click stream data, Heatmap, Average Session Time, Pages per         Session etc

#### Test
  * Unit Testing with **Mocha**
  
#### Performance Testing
  * API load testing with **Jmeter**

### System Design

#### Object Management Policy

The object management strategy for this application is straight-forward approach where we create a state instance in front-end ReactJS and we forward that object data using API calls using fetch function to the back-end server. Now, the first server is a NodeJS- ExpressJS Server which receives the object and do the necessary Server Side validation. Here the required fields that needs to be connected or interacted to the Database server are put inside an JSON Object and passed through a producer on Kafka messaging queue. The Kafka consumer receives the object and interacts with the database. The object flow throughout the system is maintained as a lightweight JSON object so that data fetching is faster.

#### Database
 ##### MySQL:
  **MySQL** can provide very good performance with structured data with proper use of **Indexing**. We used MySQL for storing   information about **Users**, **Flights**, **Hotels** and **Cars**. 
  
  Here is schema diagram of **core tables** used in the system.
  ![Kayak_DB](/readme-src/Kayak_DB.png)
  
 ##### MongoDB:
 **MongoDB** is very good in dealing with unstructured nature of data. We used MongoDB to store user transaction data which     can have high possiblity of requirement-change. It will not require refactoring code to accomodate the requirement change or   new feature request
