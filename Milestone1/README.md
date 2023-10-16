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
POST | /login              | Receives an email and password
POST | /register           | Creates a new user account and returns the new user object
GET  | /users              | Retrieves an array of all active users in the system
GET  | /users/:userId      | Retrieves a user by its Id

### Individual Team Member Contributions

