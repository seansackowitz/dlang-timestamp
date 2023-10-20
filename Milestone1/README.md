# [Timestamp App]
## Group [X]: Milestone 1

### What Is Done
We have completed implementing 70% of the static webpages from our wireframes. These pages are currently mobile friendly and are rendered differently from the desktop view. We have also implemented the API endpoints, but have not yet connected them to our system. However, they are directly accessible by the routes that will be mentioned below. The backend API endpoints will reference the mock data that we have created and stored and the frontend API endpoints will reference the webpages under the routes. The application has been configured with Docker and is live on the site.

### What Is Not Done
We have to implement 3 more pages. In particular, the splash screen when the user opens up the page and the profile settings page for the employee as well as the logs page for the business perspective to pay the employees and view their logs. We still need to fix up our API endpoints to not use mock data and we need to connect the API endpoints with the frontend. 

### Page Status
Pages   | Status | Wireframe
------- | ------ | ---------
Splash Screen | 0% | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/splash_login_signin.png) 
Login   | ✅   | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/splash_login_signin.png) 
Profile | 0%     | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/timestamp_logs_settings.png)
Register   | ✅     |  [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/splash_login_signin.png) 
Payment | 0%     | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/timestamp_business.png)
Logs   |  ✅    | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/timestamp_logs_settings.png)
Dashboard  | 90%    | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/All%20Mobile%20Wireframes.png)

### API Endpoints
Method | Route                 | Description
------ | --------------------- | ---------
POST | /api/login              | Receives a username and password
POST | /api/register/business           | Creates a new employer account and returns the new user object
POST | /api/register/employee           | Creates a new employee account and returns the new user object
POST | /api/records | Creates a new record for the employee
POST | /api/payments | Creates a payment transaction between a sender and recipient
GET  | /api/records | Retrieves every log in the "database"
GET  | /api/records/:userid | Retrieves every log associated with the user id
GET  | /api/payments | Retrieves an array of all payments
GET  | /api/payments/recipient/:recipientId | Retrieves an array of payments received by user with recipientId
GET  | /api/payments/sender/:senderId | Retrieves an array of payments sent by user with senderId
GET  | /api/users              | Retrieves an array of all active users in the system
GET  | /api/users/:userId      | Retrieves a user by its Id
PUT  | /api/users/:id | Updating the user fields in their user object (as allowed)
PUT  | /api/records/:id | Updating the record for an employee
DELETE | /api/records/:id | Deleting the user record based on record id
DELETE | /api/users/:id | Deleting the user object based on user id


### Individual Team Member Contributions
Team Member | Contributions
------------|--------------
Kuangyao Mai | Set up the frontend pages, mock data, and some API endpoints. Also set up routing for navigating between pages.
Dylan Lang | Set up the Dockerfile and docker compose file for the configuration settings and also the mock data for the users.json file. Also planned out some API endpoints that will be needed for the project. Also helped create the login page.
Michael Dacanay | Helped work on creating the login page. Also helped add API endpoints for payments and mock data.
