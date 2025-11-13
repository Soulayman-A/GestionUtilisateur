# GestionUtilisateur

This repository contains a full-stack user management application. It features a secure backend built with Java and Spring Boot, using JWT for authentication, and a frontend developed with React, TypeScript, and Chakra UI.

## Features

*   **User Authentication**: Secure registration and login functionality.
*   **JWT-based Security**: The backend API is secured using JSON Web Tokens.
*   **Full-Stack Application**: A complete system with a Spring Boot backend and a React frontend.
*   **Database Integration**: Uses MySQL for user data persistence.
*   **Modern Frontend**: Built with Vite, React, and TypeScript for a fast and type-safe development experience.

## Technology Stack

### Backend (`gestion-utilisateur-back`)

*   **Framework**: Spring Boot 3.1.5
*   **Language**: Java 17
*   **Security**: Spring Security, JSON Web Tokens (JJWT)
*   **Database**: Spring Data JPA (Hibernate) with MySQL
*   **Build Tool**: Apache Maven

### Frontend (`gestion-utilisateur-front`)

*   **Framework**: React 19
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **UI Library**: Chakra UI
*   **Styling**: Emotion, CSS
*   **Theming**: `next-themes` for light/dark mode support

## Prerequisites

Before you begin, ensure you have the following installed on your system:
*   Java JDK 17 or later
*   Apache Maven
*   Node.js (v18 or later) & npm
*   MySQL Server

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/soulayman-a/gestionutilisateur.git
cd gestionutilisateur
```

### 2. Backend Setup (`gestion-utilisateur-back`)

1.  **Navigate to the backend directory:**
    ```bash
    cd gestion-utilisateur-back
    ```

2.  **Database Configuration:**
    *   Ensure your MySQL server is running.
    *   Create a database named `gestion_utilisateur`:
        ```sql
        CREATE DATABASE gestion_utilisateur;
        ```
    *   The application uses `spring.jpa.hibernate.ddl-auto=update`, which allows Hibernate to automatically create and update the `users` table based on the `User` entity. Alternatively, you can run the provided `src/main/resources/schema.sql` script to create the table manually.

3.  **Application Properties:**
    *   Create a .env.
    
        ```properties
        DATABASE_URL=jdbc:mysql://localhost:3306/your_db_name
        DATABASE_USERNAME=your_db_username
        DATABASE_PASSWORD=your_db_password

        JWT_SECRET=your_jwt_secret_here
        JWT_EXPIRATION=86400000
        ```
    *    Replace the values with your own.

4.  **Run the Backend:**
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend server will start on `http://localhost:8080`.

### 3. Frontend Setup (`gestion-utilisateur-front`)

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../gestion-utilisateur-front 
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Frontend:**
    ```bash
    npm run dev
    ```
    The frontend development server will start on `http://localhost:5173`.

## API Endpoints

The backend exposes the following endpoints for authentication. All other endpoints require a valid JWT `Authorization: Bearer <token>` header.

### Register a User

*   **Endpoint**: `POST /api/auth/register`
*   **Description**: Creates a new user account.
*   **Request Body**:
    ```json
    {
      "username": "newuser",
      "email": "newemail",
      "password": "password123"
    }
    ```
*   **Success Response** (200 OK):
    ```
    User registered successfully: newuser
    ```

### Login a User

*   **Endpoint**: `POST /api/auth/login`
*   **Description**: Authenticates a user and returns a JWT.
*   **Request Body**:
    ```json
    {
      "username": "newuser",
      "password": "password123"
    }
    ```
*   **Success Response** (200 OK):
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "username": "newuser"
    }
