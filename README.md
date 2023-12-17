# Timestamp - GroupX
## Progress
- [Proposal](Proposal/README.md)
- [Milestone 1](Milestone1/README.md)
- [Milestone 2](Milestone2/README.md)
- [Final Project](FinalProject/README.md)

# General Information
Timestamp is a PWA that simulates a simple payroll application that supports self-employed users, employee users, and employer users. Currently, there is support for JWT, authentication & authorization, user roles, offline functionality, and installability for both mobile and desktop use. 

# How To Run
There are required technologies that need to be installed in order for this to work.

- Docker
- NodeJS
- MySQL 

To run this project, navigate to the FinalProject directory through ``cd FinalProject``. Then, run the command ``docker compose up`` (with an optional ``--build`` argument) to run the application. To restart the build each time, simply do ``docker compose down`` before doing ``docker compose up --build``. Make sure to do ``docker system prune`` in order to remove all containers and images.

# Developer's Guide
To view the state of the database using the Docker container, you can use MySQL workbench or Heidi SQL or any other client to connect to the database. Since ``port 3306`` is the default database connection with respect to your local machine, a proxy configuration was used to ensure that ``port 3307`` will be mapped to ``port 3306`` within the Docker container. Keep this in mind when setting up your database connection and connecting to the database within the Docker container.

If you want to drop the schema or modify the database tables (i.e. modify columns, add tables, remove columns, etc.), then navigate to the ``database`` directory within ``FinalProject`` and delete the ``data`` folder. Upon using ``docker compose up --build``, then the ``data`` folder will be recreated and be initialized with the ``users.sql`` file. The image build will take a little longer than usual, as it has to set up the database. Once the database container says ``Ready for connections`` within the terminal, then the database is ready.

Since service workers were implemented, frontend changes will not be initially shown unless the cache is cleared or the service worker code is modified. Therefore, to see frontend changes, ensure that ``service-worker.js`` is modified in some way such that a new service worker will be installed to the browser. Clearing the cache may be risky and cause issues, so modifying this file is the best means of viewing changes. Even though the Docker compose file is configured such that frontend changes will be automatically reflected within the running instance of the PWA, service workers will need to be disabled in some way. Since this is unknown to me at this time, this is the best way to perform frontend changes

## To Do List
Here are a list of ideas for improving the application:

- Fixing the logout button on the profile page in mobile view such that it is not hidden behind the mobile navbar
- Showing the payment history for employees and employers
- Fixing images not being cached when uploading a profile picture
- Add a delete record button for employees (if the record hadn't been paid for)
- Split the records for employees in two tabs; one to show all records and one to show all payments to the employee
- Fix the login such that it won't have to navigate to the dashboard page before taking the user to their respective role homepage
- Ensure that employers can only add self-employed users. As it stands, employers cannot be added as employers, but other employees of other business may be added to a business. However, employees are assumed to only be associated with one business.
- Make registering a business more secure by ensuring that only one instance of a business exists. This can be done through string comparisons.
- Add support for adding self-employed users to a business and promoting employees to employer status if there are multiple employers.
- Fix the date for editing an unpaid record for mobile view (low priority)
- Support an option for the user to delete their account (low priority)
- Add a function to filter records by specific periods of time for employees
- Allow employers to view the employee records before paying the employee
- Allow an employer to communicate with the employee if there are issues with the employee using web sockets
- Allow an employer to disapprove an employee's unpaid records
