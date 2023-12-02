# [Timestamp App]
## Group [X]: Final Project

### What Is Done
We have completed implementing all of the webpages from our wireframes. All of our pages support responsive design and interact with our APIs in the backend. These pages are currently mobile friendly and are rendered differently from the desktop view. We have also implemented the API endpoints and used them as appropriate for our pages. However, they are directly accessible by the routes that will be mentioned below. The backend API endpoints can reference some of the mock data that we have created and stored in the database and the frontend API endpoints will reference the webpages under the routes. However, the mock data is not needed to run the application, as it can now support live data. The application has been configured with Docker and is live on the site. In terms of what is completed for the final project, we have fully implemented service workers to cache all GET requests while the user is logged in and each and every page has been configured to notify the user when they are offline and when they cannot use the functionality of the system. On top of that, we have also made the app installable and changed the manifest.json file to tailor the application to our project.

In terms of functionality that the application provides, we have a login system that will login a user that can be of type business, employee, or self-employed. These users can register on the respective registration pages after clicking on the Register button. From the login page, the user is redirected to their respective homepages.

The employee is able to clock in their hours by either entering their hours manually or calculating their hours. The records contain the number of minutes worked, the date worked, and any notes that the employee wishes to write down. This will calculate the total hours worked and the total pay for the week. The page won't immediately add the total number of minutes to the count on the employee homepage, but will be rendered as long as the employee navigates back to the homepage after navigating elsewhere or refreshing the page.  The employee can also view their own hours and edit their records to correct any mistakes in the Hours navigation menu. Once an employee has been paid for their log, they are no longer able to edit their paid logs. To enhance the record page further, the employee can filter between paid records or unpaid records or they don't have to filter the records at all. This is all dynamically rendered in real time once the filter is selected. In the Profile menu, the user can look at their profile and make edits to their password, first name, last name, and their avatar. If the user is self-employed, then they will additionally be able to modify their hourly rate. From there, the user can save their changes by scrolling down. This will also be where the user is allowed to log out.

For an employer, they are taken to the employer homepage upon login. Employers are able to add self-employed users to their business (thus becoming employees of the business), remove employees from their business (making employees self-employed again), and modify their hourly rates. This will be the general view that they see for their business. As the employer navigates to the Payment page, this is where they are able to pay their employees for their time. The payment for the employees is based on the hourly rate of that employee and the number of minutes (converted to hours) logged. Once the employees are paid, their hours are decremented back to 0 and they cannot be paid anymore until they log more hours. Similarly to the profile page of the employee/self-employed user, the employer is able to edit their information and save their changes for their first name, last name, hourly rate, profile picture, and password.

### What Is Not Done
The clock in button is defunct as this muddied the implementation and made the overall implementation of the system too hard to keep up with. To add this feature, a new table needs to be created in the database along with new API endpoints and a new column pertaining to the user's clock in status.

### Page Status
Pages   | Status | Wireframe
------- | ------ | ---------
Splash Screen | ✅ | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/splash_login_signin.png) 
Login   | ✅   | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/splash_login_signin.png) 
Profile | ✅     | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/timestamp_logs_settings.png)
Register   | ✅     |  [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/splash_login_signin.png) 
Payment | ✅     | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/timestamp_business.png)
Logs   |  ✅    | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/timestamp_logs_settings.png)
Homepage  | ✅   | [Wireframe](https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/blob/main/Proposal/Wireframes/All%20Mobile%20Wireframes.png)

### Page Information
There are several pages to discuss here. 

The SplashScreenPage.jsx file shows the splash screen of the application with a setTimeout function that will navigate to the LoginPage.jsx file, which displays the login page.

The LoginPage.jsx file supports offline functionality in that the user will not be able to login while offline, and a toast appears notifying the user that they must go back online to login. If the user clicks the Register button, they will be taken to the RegisterPage.jsx file, which displays the generic register page. If the user clicks login with valid credentials, they will be taken to either the EmployeeHomepage.jsx file or the EmployerHomepage.jsx file, which displays the homepage for the respective user types.

The Register.jsx file has two buttons that will allow a user to register themselves as a business or a self-employed user. The business button will take them to the BusinessRegistrationPage.jsx file and the employee button will take them to the EmployeeRegistrationPage.jsx file.

The EmployeeRegistrationPage.jsx file displays a form that allows a user to register themselves as an employee. The form has a username, password, first name, and last name. The user will be taken to the LoginPage.jsx file after they successfully register. If the user is offline, then a toast is displayed stating that the user must go back online to register.

The BusinessRegistrationPage.jsx file displays a form that allows a user to register themselves as a business. The form has a username, password, first name, last name, and business name. The user will be taken to the LoginPage.jsx file after they successfully register. If the user is offline, then a toast is displayed stating that the user must go back online to register.

The EmployeeHomepage.jsx file shows the number of hours and minutes worked and two buttons that will allow the user to log their hours. If the user is offline, then a toast is displayed stating that the user must go back online to log their hours. From here, the user can use either the desktop or mobile navbar to go to the various pages. These include HoursRecord.jsx, ProfilePage.jsx, and LoginPage.jsx (if the user is on the desktop version). While the user is offline, the page will still show the number of hours and minutes worked.

The HoursRecord.jsx file shows all of the logs that the user has created along with all of the hours and minutes worked, the notes taken, the dates for the logs, edit buttons for all unpaid logs, and a filter that can be used to filter the user's logs. If the user is offline, then a toast is displayed stating that the user must go back online to modify their logs. While the user is offline, the page will still show all of the logs that the user has created and will still allow the user to filter their records. Just like the EmployeeHomepage.jsx file, the HoursRecord.jsx file has a desktop and mobile navbar that can be used to navigate to EmployeeHomepage.jsx, ProfilePage.jsx, and LoginPage.jsx (if the user is on the desktop version).

The ProfilePage.jsx file shows the user's first name, last name, affiliation, profile photo, hourly rate, and allows the user to change their password. If the user is offline, then a toast is displayed stating that the user must go back online to save their changes. While the user is offline, the page will still show the user's first name, last name, affiliation, profile picture, and hourly rate (if the user is self-employed). Just like the EmployeeHomepage.jsx file, the ProfilePage.jsx file has a desktop and mobile navbar that can be used to navigate to EmployeeHomepage.jsx, HoursRecord.jsx, and LoginPage.jsx (both mobile and desktop versions).

The EmployerHomepage.jsx file shows the user's business, the list of employees in their business, and the hourly rates for each employee. From here, using the mobile and desktop navbars, the user can navigate to the ProfilePage.jsx file, BusinessPaymentPage.jsx file, and the LoginPage.jsx file (if the user is on the desktop version). If the user is offline, they cannot modify any of their employee's hourly rate, add new employees to their business, nor remove employees from their business. While the user is offline, they can view their list of employees, their hourly rates, and their business name.

The BusinessPaymentPage.jsx file shows the user's business, the list of employees in their business, the hourly rate of each employee, and the number of unpaid hours that the employees have worked for. From here, using the mobile and desktop navbars, the user can navigate to the ProfilePage.jsx file, EmployerHomepage.jsx file, and the LoginPage.jsx file (if the user is on the desktop version). If the user is offline, they cannot pay any of their employees for their time worked. While the user is offline, they can view their list of employees, their hourly rates, and their business name.

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

## Caching Strategy
Our caching strategy uses the built-in React service workers. Since React came with service workers, this was leveraged to make the implementation of intercepting fetch requests much easier. For all of the static resources, (i.e. the pages under the /page directory that contain data that gets dynamically rendered), they are all cached by default. This is done since these would always be served to the user and ensuring that they are in the same format as if the user was online. If the user is offline, the service worker will serve the cached version of the page and use the data gathered from the respective API endpoints for all GET requests and render them on the pages as appropriate. so even if the user was offline, the page would still be rendered as though the user was online. The only exception to this is that the user won't be able to make any POST/PUT/DELETE requests while offline. However, using cache first strategy isn't enough, as when the user is online, then the data on the pages must be modified and the pages should change as the user makes these POST/PUT/DELETE requests. To do this, we use the fetch and cache strategy while the user is online to ensure that they receive the latest updates to their pages, which would then be cached for offline use should the user go offline. This ensures that the pages are all rendered dynamically while offline and serve as much content as possible while limited in connectivity. So to ensure that the application is functional, cache first is utilized while the user is offline and fetch and cache is used while the user is online.

## Authentication & Authorization
In terms of authentication and authorization, we are using cookies that are sent over HTTPS that contain the headers, payload, and the signature of the user, excluding the salt and password. The salt has been randomly assigned to the users in the mock data that are 32 characters long and they are used for hashing the password that is stored with the user in the database. The password is hashed using the SHA-512 hashing algorithm 100,000 with a length of 64 characters. After the user logs in with a username, the backend will search for the username and if there is a match, then it will compare passwords to see if the user should be allowed to log in. If the passwords match, then the JWT of the user is sent. Otherwise, the user cannot log in and must try again. In addition, we have protected all of our API endpoints using TokenMiddleware that will check for this token of the current user and will also ensure the integrity of the token as well. We also protect our frontend routes by calling the endpoint to check the current user and if the user does not exist, then they are redirected back to the login page. The current user is found by reading the JWT. In terms of role authorization, depending on how the user registers an account, they will be assigned a role of either business or self-employed. The role is saved with the user the moment they register and it gets added to the database. Using this and checking the current user, we compare the roles of the user and perform relevant checks to ensure that employees are allowed to only access their page and employers are only allowed to acces the employer pages. In addition, these users will not be able to see data of other users in the system using role authorization and using endpoints to reference the user based on ID.

## ER Diagram
![image](https://media.github.ncsu.edu/user/20833/files/24ae21d3-813a-458d-aef4-03cb54bcd783)

Link to more information: https://github.ncsu.edu/engr-csc342/csc342-2023Fall-GroupX/wiki/TimeStamp-ER-Diagram

### Individual Team Member Contributions

#### Project Proposal
So far, there have been contributions from all team members for working on the wireframes and its respective transitions. Dylan was the one who came up with the initial project proposal before the idea was extended further by Michael. We also brainstormed to get the optimal app name. In terms of dividing work in the future, there are no tentative plans in place as of yet.

#### Milestone 1
Team Member | Contributions
------------|--------------
Kuangyao Mai | Set up the frontend pages, mock data, and some API endpoints. Also set up routing for navigating between pages.
Dylan Lang | Set up the Dockerfile and docker compose file for the configuration settings and also the mock data for the users.json file. Also planned out some API endpoints that will be needed for the project. Also helped create the login page.
Michael Dacanay | Helped work on creating the login page. Also helped add API endpoints for payments and mock data.

#### Milestone 2
Team Member | Contributions
------------|--------------
Kuangyao Mai | Set up the frontend pages and a lot of API endpoints related to profiles of users, payments, and registration for employers and employees. Also set up routing for navigating between pages. Also worked on responsive design and dynamically rendering content based on the currently logged in user for the employers and employees.
Dylan Lang | Set up the Dockerfile and docker compose file for the configuration settings and also set up the SQL file for the tables and mock data. Worked on various pages to interact with the APIs, such as POST, GET, and PUT requests for records. Also protected the frontend routes with role authorization and checking the current user and dynamically rendering hours and minutes worked for records and the name of the currently logged in user.
Michael Dacanay | Worked on the payment page (invoices for business to pay employee wages) and payment confirmation page.

#### Final Project
Team Member | Contributions
------------|--------------
Kuangyao Mai | Worked on addressing the feedback from Milestone 2 to make the system more intuitive to use and finished the Payment page to be responsive and work as intended. Also updated other pages to be responsive. Worked on updating the Manifest to ensure that the application is installable. Also fixed the profile photo not being updated when the user changes it on the profile page.
Dylan Lang | Worked on supporting offline functionality with the service worker for all of the mentioned pages above and also helped with supporting responsive design for various pages. Also made some bug fixes to removing an employee, editing a record, and POSTing a new manual employee record.
Michael Dacanay | Worked on the clock in button (that was later found to be too time consuming of a feature to implement e.g. while the timer works and displays length of current session on the screen, the timer does not persist when changing pages) and added UI enhancements, such as back buttons and the wifi icon to notify the user is offline.