# Event Booking System - Frontend

## Project Overview
This is the frontend application for the Event Booking System. Built with React, it allows users to browse events, make bookings, and manage their profiles.

## Prerequisites
- Node.js (version 16 or higher recommended)
- npm or yarn package manager

## Installation
```bash
git clone <repo-url>
npm install

## Running the Project

# To start the development server, run:
npm start server

# To start the development front-end, run:
npm start start

- The server will be available at http://localhost:5000.
- The app itself will be available at http://localhost:5001.

## Environment Variables

#If needed, create a .env file in the frontend directory with:
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000

you can generate JWT_SECRET by unning -> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

## Project Structure

/server
  /images  - app images
  /models       - mongodb models for (Bookings, Events, Users, etc)
  /routes    - API calls 
    /auth  - login, signup APIs
    /booking       - bookings APIs
    /Event  - API calls for the admin to cerate, update, read events.
  /server.js -  server Middleware, Routes and Connection to MongoDB.

/src
  /pages       - App pages (Home, Profile, Admin, etc.)
  App.js     - App entry point



## Note
Make sure backend API is running before starting the frontend.
Make sure MongoDB is running or accessible.
Use Postman or similar tools to test API endpoints.

