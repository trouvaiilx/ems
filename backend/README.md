# EMS Backend

This is the backend for the Event Management System (EMS), built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed locally or a cloud instance)

## Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    - Create a `.env` file in the `backend` root.
    - Copy the contents of `.env.example` to `.env`.
    - Update `MONGO_URI` and `JWT_SECRET` as needed.

    ```bash
    cp .env.example .env
    ```

4.  Start the Server:
    ```bash
    # Development mode (with nodemon)
    npm run dev

    # Production mode
    npm start
    ```

The server will run on `http://localhost:5000` by default.

## API Structure

- **Auth**: `/api/auth`
  - `POST /register`: Register a new user
  - `POST /login`: Login
  - `GET /me`: Get current user profile
- **Events**: `/api/events`
  - `GET /`: List all events
  - `POST /`: Create event (Organizer/Admin)
  - `GET /:id`: Get event details
  - `PUT /:id`: Update event
  - `DELETE /:id`: Delete event
- **Tickets**: `/api/tickets`
  - `GET /event/:eventId`: Get ticket types for an event
  - `POST /`: Create ticket type
- **Bookings**: `/api/bookings`
  - `POST /`: Create booking
  - `GET /my`: Get my bookings
