# Hangman Application

## Description
The Hangman application is an online game based on the popular paper game. Players guess letters to uncover a secret word represented by a series of dashes. The backend of the application is built with Express, and the frontend with React. JSON Web Tokens are used for user authentication as players or administrators. Additionally, the application supports a player ranking system using MQTT and displays ads using Server-Sent Events.

## Project Structure
- `client/` - folder containing the backend code based on Express
- `serwer/` - folder containing the frontend code based on React

## Backend (Express)
The backend of the application handles user authentication, JWT mechanism, MQTT handling, and communicates with the MongoDB database using HTTP requests.

## Frontend (React)
The frontend of the application is responsible for the user interface, handles game logic, displaying the game, registration/login forms, and presenting rankings.

### Authentication
- Users can register as players or administrators.
- JWT is used for user authentication.
- Players and administrators have access to different parts of the application.

### MQTT
- Uses MQTT for handling player rankings.
- Updates the ranking after each game.

### SSE
- The application utilizes Server-Sent Events to dynamically display ads in the user interface.
