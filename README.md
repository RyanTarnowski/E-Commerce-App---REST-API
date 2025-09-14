# E-Commerce-App---REST-API


## About The Project

The goal of this project was to build a basic e-commerce REST API and document the API with swagger.

### Built With

* Express JS
* Passport JS
* Postgres SQL
* Swagger

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* Postgres SQL
* Node JS


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/RyanTarnowski/E-Commerce-App---REST-API.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Open the scripts directory and run the "Create Table.sql" file on your Postgres server
4. Open the scripts directory and run the "Test Data.sql" file on your Postgres server
5. Create a config.env file within the root directory and add the following
   ```
    PGUSER=[Postgres UserName]
    PGPASSWORD=[Postgres Password]
    PGHOST=[Postgres IP/Localhost]
    PGPORT=[Postgres Port (5432)] 
    PGDATABASE=e_commerce
    SESSIONSECRET=[Session Secret (something random)] 
    PORT=[Port number to run the app on (3000)]
   ```
6. Run the application
   ```sh
   node server.js
   ```
7. From a browser navigate to http://localhost:3000/api/docs/#/ to review the routes provided by the API and how to use them