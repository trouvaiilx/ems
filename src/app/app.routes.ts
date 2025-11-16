// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./features/auth/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/attendee/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/attendee/event-list/event-list.component').then(
        (m) => m.EventListComponent
      ),
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./features/attendee/event-detail/event-detail.component').then(
        (m) => m.EventDetailComponent
      ),
  },
  {
    path: 'booking/:eventId',
    loadComponent: () =>
      import('./features/attendee/booking/booking.component').then((m) => m.BookingComponent),
    canActivate: [authGuard, roleGuard([UserRole.ATTENDEE])],
  },
  {
    path: 'payment/:bookingId',
    loadComponent: () =>
      import('./features/attendee/payment/payment.component').then((m) => m.PaymentComponent),
    canActivate: [authGuard, roleGuard([UserRole.ATTENDEE])],
  },
  {
    path: 'my-tickets',
    loadComponent: () =>
      import('./features/attendee/my-tickets/my-tickets.component').then(
        (m) => m.MyTicketsComponent
      ),
    canActivate: [authGuard, roleGuard([UserRole.ATTENDEE])],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'register-organizer',
        loadComponent: () =>
          import('./features/admin/register-organizer/register-organizer.component').then(
            (m) => m.RegisterOrganizerComponent
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/admin/analytics/admin-analytics.component').then(
            (m) => m.AdminAnalyticsComponent
          ),
      },
    ],
  },
  {
    path: 'organizer',
    canActivate: [authGuard, roleGuard([UserRole.ORGANIZER])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/organizer/dashboard/organizer-dashboard.component').then(
            (m) => m.OrganizerDashboardComponent
          ),
      },
      {
        path: 'events/create',
        loadComponent: () =>
          import('./features/organizer/event-create/event-create.component').then(
            (m) => m.EventCreateComponent
          ),
      },
      {
        path: 'events/:id/edit',
        loadComponent: () =>
          import('./features/organizer/event-edit/event-edit.component').then(
            (m) => m.EventEditComponent
          ),
      },
      {
        path: 'events/:id/tickets',
        loadComponent: () =>
          import('./features/organizer/ticket-setup/ticket-setup.component').then(
            (m) => m.TicketSetupComponent
          ),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/organizer/analytics/organizer-analytics.component').then(
            (m) => m.OrganizerAnalyticsComponent
          ),
      },
    ],
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
