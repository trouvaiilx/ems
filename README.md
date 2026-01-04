# Event Management System (EMS)

A comprehensive web-based event management system built with the MEAN stack (MongoDB, Express, Angular, Node.js).

## 🎯 Project Overview

This Event Management System allows:
- **Administrators** to register event organizers and view analytics
- **Event Organizers** to create events, set up tickets, and manage bookings
- **Attendees** to browse events, book tickets, and receive digital QR codes

---

## 📝 Project Report: Technical Implementation & Manual

### 1. New Web Technologies & Justification

The following technologies have been implemented to transform the static frontend prototype into a fully functional dynamic web application.

#### **Backend Runtime & Framework**
- **Node.js**: chosen for its non-blocking, event-driven architecture which handles concurrent requests efficiently. It allows the use of JavaScript on both the client and server, unifying the development stack.
- **Express.js**: chosen as the web application framework for Node.js. It provides a robust set of features for web and mobile applications, including simplified routing and middleware integration, which accelerates API development.

#### **Database & Modeling**
- **MongoDB**: A NoSQL database selected for its flexibility and ability to store data in JSON-like documents, which maps directly to the data structures used in the frontend application.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB. It is used to enforce schemas (e.g., User, Event, Ticket schemas), perform data validation, and manage relationships between data entities.

#### **Authentication & Security**
- **JSON Web Tokens (JWT)**: Implemented for stateless authentication. It allows the server to verify user identity without storing session state, making the application scalable.
- **Bcrypt.js**: Used for hashing passwords before storage. This ensures that sensitive user credentials are secure even if the database is compromised.
- **Cors**: Middleware used to enable Cross-Origin Resource Sharing, allowing the Angular frontend (running on a different port) to securely communicate with the backend API.

#### **Functionality & Features**
- **Multer**: Middleware for handling `multipart/form-data`. It is used to upload and store event posters and user profile images efficiently.
- **Nodemailer**: A module for Node.js applications to send emails. It is used to send booking confirmations and system notifications to users.
- **Google APIs (OAuth2)**: Integrated to authenticate with Gmail servers securely, ensuring reliable email delivery without exposing raw passwords.
- **PDFKit**: Used for server-side PDF generation. This allows the system to dynamically generate downloadable reports and tickets.
- **QRCode**: A library used to generate QR codes for tickets, which can be scanned for event entry.

### 2. Manual Guide: Configuration & Installation

Follow these steps to set up and execute the application locally.

#### **Prerequisites**
1.  **Node.js**: Download and install from [nodejs.org](https://nodejs.org/) (v18+ recommended).
2.  **MongoDB**: Install MongoDB Community Server locally or set up a cloud cluster via MongoDB Atlas.
3.  **Angular CLI**: Install globally using the command:
    ```bash
    npm install -g @angular/cli
    ```

#### **Step 1: Backend Setup**

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install required dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend/` root directory and configure the following variables:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/ems_db
    JWT_SECRET=your_super_secret_key_here
    NODE_ENV=development

    # Email Configuration (Optional for email features)
    GMAIL_USER=your_email@gmail.com
    GMAIL_CLIENT_ID=your_oauth_client_id
    GMAIL_CLIENT_SECRET=your_oauth_client_secret
    GMAIL_REFRESH_TOKEN=your_oauth_refresh_token
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```
    *The server should be running on `http://localhost:5000`*

#### **Step 2: Frontend Setup**

1.  Open a new terminal and navigate to the project root (if not already there):
    ```bash
    cd path/to/project-root
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the Angular development server:
    ```bash
    ng serve
    ```
4.  Open your browser and navigate to:
    ```
    http://localhost:4200/
    ```

---

## 📋 Features Implementation

### Use Case 1: Register Event Organizers ✅
- Admin dashboard with organizer registration
- Automatic credential generation
- Email notification simulation
- Input validation

### Use Case 2: Event Creation ✅
- Organizer dashboard with event management
- Date availability checking
- Poster upload support
- Event details form with validation

### Use Case 3: Ticket Setup ✅
- Multiple ticket categories (General, VIP, Senior, Child)
- Seating sections (Balcony, Mezzanine, Stall)
- Flexible pricing
- Promotional code configuration

### Use Case 4: Ticket Booking ✅
- Real-time seat availability
- Interactive seat selection
- Promo code application
- Booking summary

### Use Case 5: Payment Processing ✅
- Multiple payment methods
- Secure payment simulation
- QR code generation
- Email confirmation

### Use Case 6: Waitlist Management ✅
- Join waitlist for sold-out events
- Automatic notification system
- Waitlist capacity limits

### Use Case 7: Analytics & Reports ✅
- Sales reports (daily/weekly/monthly)
- Occupancy statistics
- Revenue tracking
- Export to PDF/CSV

## 👥 Demo Credentials

### Admin
- Username: `admin`
- Password: `password`

### Event Organizer
- Username: `organizer1`
- Password: `password`
- First login requires password change

### Attendee
- Username: `attendee1`
- Password: `password`

## 👨‍💻 Development Team

[Your Name/Team Names]
BIT306 Group Assignment
HELP University

## 📄 License

This project is developed for educational purposes as part of BIT306 coursework.
