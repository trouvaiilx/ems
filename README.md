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

The following technologies have been implemented to transform the static frontend prototype into a fully functional dynamic web application. Each technology was selected to ensure scalability, security, and ease of development.

#### **Backend Runtime & Framework**
- **Node.js**:
  - **Justification**: Chosen for its non-blocking, event-driven architecture which handles concurrent requests efficiently—crucial for real-time ticket bookings where multiple users might access the system simultaneously. It also enables a unified JavaScript stack (frontend and backend), simplifying data validation and code sharing.
- **Express.js**:
  - **Justification**: A minimal and flexible web application framework for Node.js. It was implemented to streamline API development through its robust middleware ecosystem. We utilize Express to handle routing, parse incoming JSON requests, and manage authentication flows with significantly less boilerplate code than raw Node.js.

#### **Database & Modeling**
- **MongoDB**:
  - **Justification**: A NoSQL document database selected for its schema flexibility. Storing data in BSON (binary JSON) format allows for seamless integration with the Angular frontend, which consumes JSON APIs. It naturally handles hierarchical data structures like nested ticket categories within an event.
- **Mongoose**:
  - **Justification**: An Object Data Modeling (ODM) library that provides a rigorous modeling environment for MongoDB. It is implemented to enforce data integrity via schemas (e.g., ensuring an email is valid before saving) and to handle complex database interactions like populating related data (e.g., fetching User details when querying a Booking).

#### **Authentication & Security**
- **JSON Web Tokens (JWT)**:
  - **Justification**: Implemented for secure, stateless authentication. Unlike session-based auth, JWTs do not require server-side storage, reducing memory overhead and allowing the backend to scale easily. Tokens are signed to prevent tampering and contain encoded user roles for efficient authorization checks.
- **Bcrypt.js**:
  - **Justification**: A password-hashing function used to secure user credentials. It implements salting and adaptive hashing, ensuring that even if the database is breached, user passwords remain computationally resistant to rainbow table attacks.
- **Cors**:
  - **Justification**: Middleware essential for decoupling the frontend and backend. It explicitly allows the Angular application (running on port 4200) to request resources from the Express server (running on port 5000), preventing browser security errors during cross-origin resource sharing.

#### **Functionality & Features**
- **Multer**:
  - **Justification**: Middleware specifically designed for handling `multipart/form-data`. It is required for the file upload feature, allowing event organizers to upload high-quality poster images which are then sanitised and stored on the server.
- **Nodemailer**:
  - **Justification**: A standard module for sending emails from Node.js. It drives the notification system, delivering transactional emails such as booking confirmations and "Welcome" messages to newly registered users.
- **Google APIs (OAuth2)**:
  - **Justification**: Used to authorize Nodemailer with Gmail services using the OAuth2 protocol. This is more secure than storing plain-text passwords, as it uses refresh tokens to maintain access, ensuring the email service remains uninterrupted and secure.
- **PDFKit**:
  - **Justification**: A PDF generation library used server-side to dynamically create documents. It allows the system to generate professional-grade sales reports and downloadble tickets on the fly based on real-time database content.
- **QRCode**:
  - **Justification**: A library for generating 2D barcodes. It creates unique QR codes containing encrypted booking IDs for every ticket, facilitating a contactless and secure check-in process at the event venue.

### 2. Manual Guide: Configuration & Installation

Follow these comprehensive steps to set up the development environment and execute the application locally.

#### **Prerequisites**
Before starting, ensure the following tools are installed on your machine:
1.  **Node.js**: (v18 or higher recommended). Verify installation by running `node -v` in your terminal.
2.  **MongoDB**: A running instance of MongoDB. This can be:
    *   **Local**: [MongoDB Community Server](https://www.mongodb.com/try/download/community) running on default port `27017`.
    *   **Cloud**: A generic connection string from [MongoDB Atlas](https://www.mongodb.com/atlas).
3.  **Angular CLI**: The command-line interface for Angular. Install globally:
    ```bash
    npm install -g @angular/cli
    ```

#### **Step 1: Backend Setup**

The backend handles the API, database connections, and business logic.

1.  **Navigate to the backend directory**:
    Open your terminal/command prompt and run:
    ```bash
    cd backend
    ```

2.  **Install Dependencies**:
    Download all required libraries defined in `package.json`:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a new file named `.env` in the `backend/` root directory. Copy and paste the following configuration, replacing the placeholder values with your actual credentials:

    ```env
    # Server Configuration
    PORT=5000
    NODE_ENV=development

    # Database Connection
    # Use 'mongodb://localhost:27017/ems_db' for local MongoDB
    MONGO_URI=mongodb://localhost:27017/ems_db

    # Security
    # Enter a long, random string for signing JWT tokens
    JWT_SECRET=your_super_secret_key_here

    # Email Service (Required for Email Notifications)
    # These credentials can be obtained from the Google Cloud Console (OAuth 2.0 Client IDs)
    GMAIL_USER=your_email@gmail.com
    GMAIL_CLIENT_ID=your_oauth_client_id
    GMAIL_CLIENT_SECRET=your_oauth_client_secret
    GMAIL_REFRESH_TOKEN=your_oauth_refresh_token
    ```

4.  **Start the Backend Server**:
    Launch the server in development mode (with auto-restart on file changes):
    ```bash
    npm run dev
    ```
    *Success Indicator: You should see "Server running on port 5000" and "MongoDB Connected" in the terminal.*

#### **Step 2: Frontend Setup**

The frontend is the user interface built with Angular.

1.  **Navigate to the Project Root**:
    Open a **new** terminal window (keep the backend running) and go to the main project folder:
    ```bash
    cd path/to/project-root
    ```

2.  **Install Dependencies**:
    Install the Angular packages and other frontend libraries:
    ```bash
    npm install
    ```

3.  **Start the Angular Development Server**:
    Compile and serve the application:
    ```bash
    ng serve
    ```

4.  **Access the Application**:
    Once the build is complete, open your web browser and go to:
    ```
    http://localhost:4200/
    ```

#### **Troubleshooting**
*   **"MongoDB Connection Error"**: Ensure your local MongoDB service is running (search for "MongoDB Compass" or check your services) or that your IP is whitelisted if using MongoDB Atlas.
*   **"Port 5000 already in use"**: This means another process is using the backend port. You can kill the process or change `PORT=5000` to `PORT=5001` in your `.env` file.

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
