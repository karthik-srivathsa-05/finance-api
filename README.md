# Personal Finance Tracker API
This repository contains the backend RESTful API for a personal finance tracking application as per the requirements posted. It allows users to register, log in, and manage their income and expense transactions. The API is built with Node.js, Express, and MongoDB.

## Features
-   **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
-   **Transaction Management**: Full CRUD (Create, Read, Update, Delete) functionality for financial transactions.
-   **Dashboard Summary**: An endpoint to get a monthly summary of total income, expenses, and current balance.
-   **Data Validation**: Input validation to ensure data integrity.
-   **Protected Routes**: Middleware to protect sensitive endpoints, ensuring only authenticated users can access their own data.

## Technology Stack
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JSON Web Tokens(JWT), bcrypt.js
-   **API Testing**: Postman
-   **Security**: `helmet`, `cors`
-   **Environment Variables**: `dotenv`
-   **Validation**: `express-validator`

## API Endpoints
Here is a list of the available API endpoints. All protected routes require a `Bearer Token` in the `Authorization` header.

| Method  | Endpoint                            | Description                                  
| ------  | ----------------------------------- | -----------------------------------------   
| `POST`  | `/api/auth/register`                | Register a new user.                         
| `POST`  | `/api/auth/login`                   | Login an existing user and get a JWT.        
| `POST`  | `/api/transactions`                 | Add a new transaction.                      
| `GET`   | `/api/transactions`                 | Get all transactions for the logged-in user. 
| `PUT`   | `/api/transactions/:id`             | Update a specific transaction.               
| `DELETE`| `/api/transactions/:id`             | Delete a specific transaction.               
| `GET`   | `/api/summary/all`                  | Get the dashboard financial summary.         
| `GET`   | `/api/analytics/category-summary`   | Get a summary of spending by category.       


## Setup and Installation
To get a local copy up and running, follow these simple steps.

### Prerequisites
-   Node.js and npm installed
-   A free MongoDB Atlas account

### Installation
1.  **Clone the repository:**
    git clone (https://github.com/karthik-srivathsa-05/finance-api)

2.  **Navigate to the project directory:**
    cd finance-api

3.  **Install NPM packages:**
    npm install

4.  **Set up environment variables:**
    - Create a file named `.env` in the root of the project.
    - Copy the contents of `.env.example` into your new `.env` file.
    - Fill in the required values (your `MONGO_URI` and a `JWT_SECRET`).

    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key

5.  **Run the server:**
     ```sh
    npm run dev
    ```

The server will start on `http://localhost:5001` (or whatever port is specified).