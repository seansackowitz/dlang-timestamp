# [Timestamp App]
## Group [X]: Milestone 2

### What Is Done
We have completed implementing at least 80% of the webpages from our wireframes. In addition, most of our pages support responsive design and interact with our APIs in the backend. These pages are currently mobile friendly and are rendered differently from the desktop view. We have also implemented the API endpoints, but not every API endpoint has been tested nor is needed. However, they are directly accessible by the routes that will be mentioned below. The backend API endpoints can reference some of the mock data that we have created and stored in the database and the frontend API endpoints will reference the webpages under the routes. The application has been configured with Docker and is live on the site.

### What Is Not Done
We have to implement at least 1 more page for the payment, as that is currently a static website. It doesn't interact with the API endpoints and may need to be changed up significantly to match the scheme of our application. 

### Page Status
Pages   | Status | Wireframe
------- | ------ | ---------
Splash Screen | ✅ | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/splash_login_signin.png) 
Login   | ✅   | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/splash_login_signin.png) 
Profile | 95%     | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/timestamp_logs_settings.png)
Register   | ✅     |  [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/splash_login_signin.png) 
Payment | 50%     | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/timestamp_business.png)
Logs   |  ✅    | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/timestamp_logs_settings.png)
Homepage  | ✅   | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/All%20Mobile%20Wireframes.png)

### API Endpoints
Status | Method | Route                 | Description
----- |------ | --------------------- | ---------
✅ | POST | /api/login                       | Receives a username and password and sends a JWT if valid
✅| POST | /api/register/business           | Creates a new employer account and returns the new user object
✅| POST | /api/register/employee           | Creates a new employee account and returns the new user object
✅| POST | /api/records/manual              | Creates a new record for the employee based on manual time calculation
✅| POST | /api/records/calculate           | Creates (at least) one new record for the employee based on start and end time calculations
✅| POST | /api/payments                    | Creates a payment transaction between a sender and recipient
✅| POST | /api/logout                      | Logs the user out and removes their JWT
✅| GET  | /api/login/users/current         | Retrieves the current user based on the JWT
✅| GET  | /api/records/:id                 | Retrieves every log associated with the user id
✅| GET  | /api/payments/recipient/:recipientId | Retrieves an array of payments received by user with recipientId
✅| GET  | /api/payments/sender/:senderId | Retrieves an array of payments sent by user with senderId
✅| GET  | /api/users/:username | Retrieves a user by username (for employers to search for employees to add)
✅| GET  | /api/:username/employees | Retrieves all employees affiliated with the employer
✅| PUT  | /api/users/:username | Updates the user based on the username of the user (as allowed)
✅| PUT  | /api/users/employer/:username | Updates a self-employed user to become an employee and update hourly rate
✅| PUT  | /api/records/:id | Updating the record based on record id

A brief description of your authentication and authorization processes. What techniques are you using? What data is being stored where and how? How are you making sure users only access what they are allowed to?

## Authentication & Authorization
in terms of authentication and authorization, we are using cookies that are sent over HTTPS that contain the headers, payload, and the signature of the user, excluding the salt and password. The salt has been randomly assigned to the users in the mock data that are 32 characters long and they are used for hashing the password that is stored with the user in the database. The password is hashed using the SHA-512 hashing algorithm 100,000 with a length of 64 characters. After the user logs in with a username, the backend will search for the username and if there is a match, then it will compare passwords to see if the user should be allowed to log in. If the passwords match, then the JWT of the user is sent. Otherwise, the user cannot log in and must try again. In addition, we have protected all of our API endpoints using TokenMiddleware that will check for this token of the current user and will also ensure the integrity of the token as well. We also protect our frontend routes by calling the endpoint to check the current user and if the user does not exist, then they are redirected back to the login page. The current user is found by reading the JWT. In terms of role authorization, depending on how the user registers an account, they will be assigned a role of either business or self-employed. The role is saved with the user the moment they register and it gets added to the database. Using this and checking the current user, we compare the roles of the user and perform relevant checks to ensure that employees are allowed to only access their page and employers are only allowed to acces the employer pages. In addition, these users will not be able to see data of other users in the system using role authorization and using endpoints to reference the user based on ID.

### Individual Team Member Contributions
Team Member | Contributions
------------|--------------
Kuangyao Mai | Set up the frontend pages and a lot of API endpoints related to profiles of users, payments, and registration for employers and employees. Also set up routing for navigating between pages.
Dylan Lang | Set up the Dockerfile and docker compose file for the configuration settings and also set up the SQL file for the tables and mock data. Worked on various pages to interact with the APIs, such as .
Michael Dacanay | Helped work on creating the login page. Also helped add API endpoints for payments and mock data.
