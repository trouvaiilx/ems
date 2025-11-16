# Event Management System (EMS)

A comprehensive web-based event management system built with Angular for HELP Events auditorium.

## 🎯 Project Overview

This Event Management System allows:
- **Administrators** to register event organizers and view analytics
- **Event Organizers** to create events, set up tickets, and manage bookings
- **Attendees** to browse events, book tickets, and receive digital QR codes

## 🚀 Technologies Used

- **Framework**: Angular 20.3.0
- **Language**: TypeScript 5.9.2
- **Styling**: CSS3 with modern gradients and animations
- **State Management**: RxJS Observables
- **Routing**: Angular Router with lazy loading
- **Authentication**: Role-based access control (RBAC)

### Key Libraries & Features:
- Standalone Components (Angular 14+)
- Reactive Forms with FormsModule
- Route Guards for security
- Service-based architecture
- Responsive design (mobile-first)

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

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── models/              # Data models & interfaces
│   │   ├── services/            # Business logic services
│   │   └── guards/              # Route guards
│   ├── features/                # Feature modules
│   │   ├── auth/                # Authentication
│   │   ├── admin/               # Admin features
│   │   ├── organizer/           # Organizer features
│   │   └── attendee/            # Attendee features
│   ├── shared/                  # Shared components
│   │   └── components/          # Reusable UI components
│   ├── app.ts                   # Root component
│   ├── app.routes.ts            # Application routes
│   └── app.config.ts            # App configuration
├── styles.css                   # Global styles
└── index.html                   # HTML entry point
```

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`

### Step 3: Build for Production
```bash
ng build
```
Build artifacts will be stored in the `dist/` directory.

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

## 🎨 Design Highlights

### Color Palette
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Purple)
- Success: `#10b981` (Green)
- Error: `#ef4444` (Red)
- Background: `#f9fafb` (Light Gray)

### Typography
- Font Family: Inter, system fonts
- Headings: 600 weight
- Body: 400 weight

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 968px
- Desktop: > 968px

## 🔐 Security Features

- Role-based access control (Admin, Organizer, Attendee)
- Route guards preventing unauthorized access
- Password validation
- Input sanitization
- First-login password change requirement

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones

## 🧪 Testing

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## 📊 Performance Optimizations

- Lazy loading of feature modules
- Standalone components for better tree-shaking
- OnPush change detection strategy
- Optimized bundle sizes
- Image optimization

## 🚧 Future Enhancements

1. **Backend Integration**
   - REST API integration
   - Database persistence
   - Real-time updates with WebSockets

2. **Advanced Features**
   - Email/SMS notifications
   - Payment gateway integration
   - PDF ticket generation
   - QR code scanning app

3. **Analytics**
   - Advanced reporting dashboard
   - Data visualization with charts
   - Export functionality

4. **User Experience**
   - Push notifications
   - Progressive Web App (PWA)
   - Multi-language support

## 📝 Assignment Submission Checklist

- ✅ Source code uploaded
- ✅ Project report (see separate document)
- ✅ Video demonstration
- ✅ User manuals
- ✅ Technologies justification
- ✅ Installation guide
- ✅ References in APA format

## 👨‍💻 Development Team

[Your Name/Team Names]
BIT306 Group Assignment
HELP University

## 📄 License

This project is developed for educational purposes as part of BIT306 coursework.

## 🙏 Acknowledgments

- Angular Team for the excellent framework
- HELP Events for the case study
- Course instructors for guidance

## 📞 Support

For questions or issues:
- Email: [your.email@help.edu.my]
- Course Portal: HLMS BIT306

---

**Note**: This is a prototype/educational project. For production use, additional security measures, testing, and backend implementation would be required.