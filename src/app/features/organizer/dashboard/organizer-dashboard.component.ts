// src/app/features/organizer/dashboard/organizer-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <div class="dashboard-header">
          <div>
            <h1>Organizer Dashboard</h1>
            <p>Welcome back, {{ currentUser?.fullName }}</p>
          </div>
          <a routerLink="/organizer/events/create" class="btn btn-primary">
            ➕ Create New Event
          </a>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎭</div>
            <div class="stat-content">
              <h3>{{ myEvents.length }}</h3>
              <p>My Events</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎫</div>
            <div class="stat-content">
              <h3>{{ getTotalBookings() }}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>RM {{ getTotalRevenue() }}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <h3>{{ getUpcomingEvents() }}</h3>
              <p>Upcoming</p>
            </div>
          </div>
        </div>

        <div class="content-section">
          <div class="section-header">
            <h2>My Events</h2>
            <div class="filter-tabs">
              <button 
                class="tab-btn"
                [class.active]="activeFilter === 'all'"
                (click)="setFilter('all')"
              >
                All
              </button>
              <button 
                class="tab-btn"
                [class.active]="activeFilter === 'upcoming'"
                (click)="setFilter('upcoming')"
              >
                Upcoming
              </button>
              <button 
                class="tab-btn"
                [class.active]="activeFilter === 'draft'"
                (click)="setFilter('draft')"
              >
                Drafts
              </button>
            </div>
          </div>

          @if (loading) {
            <div class="loading">Loading events...</div>
          } @else if (filteredEvents.length > 0) {
            <div class="events-list">
              @for (event of filteredEvents; track event.id) {
                <div class="event-card">
                  @if (event.posterUrl) {
                    <div class="event-poster" [style.background-image]="'url(' + event.posterUrl + ')'"></div>
                  } @else {
                    <div class="event-poster placeholder">🎭</div>
                  }
                  <div class="event-details">
                    <div class="event-header">
                      <div>
                        <h3>{{ event.name }}</h3>
                        <p class="event-date">{{ event.date | date:'fullDate' }} • {{ event.time }}</p>
                      </div>
                      <span class="status-badge" [class]="event.status.toLowerCase()">
                        {{ event.status }}
                      </span>
                    </div>
                    <p class="event-description">{{ event.description }}</p>
                    <div class="event-actions">
                      <a [routerLink]="['/organizer/events', event.id, 'edit']" class="btn btn-secondary">
                        ✏️ Edit
                      </a>
                      <a [routerLink]="['/organizer/events', event.id, 'tickets']" class="btn btn-secondary">
                        🎫 Tickets
                      </a>
                      <a [routerLink]="['/events', event.id]" class="btn btn-outline">
                        👁️ View
                      </a>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state">
              <div class="empty-icon">📭</div>
              <h3>No events found</h3>
              <p>Start by creating your first event</p>
              <a routerLink="/organizer/events/create" class="btn btn-primary">
                Create Event
              </a>
            </div>
          }
        </div>

        <div class="quick-links">
          <h2>Quick Actions</h2>
          <div class="links-grid">
            <a routerLink="/organizer/analytics" class="link-card">
              <span class="link-icon">📊</span>
              <div>
                <h4>Analytics</h4>
                <p>View event performance</p>
              </div>
            </a>
            <a routerLink="/organizer/events/create" class="link-card">
              <span class="link-icon">➕</span>
              <div>
                <h4>Create Event</h4>
                <p>Setup new event</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      background: #f9fafb;
      padding: 2rem;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .dashboard-header p {
      color: #666;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: transform 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      font-size: 3rem;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 1rem;
    }

    .stat-content h3 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .content-section {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-header h2 {
      margin: 0;
      color: #333;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
    }

    .tab-btn {
      padding: 0.5rem 1.5rem;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 600;
      color: #666;
    }

    .tab-btn:hover {
      border-color: #6366f1;
      color: #6366f1;
    }

    .tab-btn.active {
      background: #6366f1;
      color: white;
      border-color: #6366f1;
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .event-card {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 1.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 1rem;
      overflow: hidden;
      transition: all 0.3s;
    }

    .event-card:hover {
      border-color: #6366f1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .event-poster {
      height: 200px;
      background-size: cover;
      background-position: center;
    }

    .event-poster.placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
    }

    .event-details {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
    }

    .event-header h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.5rem;
    }

    .event-date {
      color: #6366f1;
      margin: 0;
      font-weight: 500;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.published {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.draft {
      background: #fef3c7;
      color: #92400e;
    }

    .event-description {
      color: #666;
      margin: 0;
      flex: 1;
    }

    .event-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      border: none;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover {
      background: #4f46e5;
    }

    .btn-secondary {
      background: #e5e7eb;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d1d5db;
    }

    .btn-outline {
      background: white;
      color: #6366f1;
      border: 2px solid #6366f1;
    }

    .btn-outline:hover {
      background: #6366f1;
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .empty-state p {
      color: #666;
      margin: 0 0 2rem 0;
    }

    .quick-links {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quick-links h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .link-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.3s;
    }

    .link-card:hover {
      border-color: #6366f1;
      transform: translateX(5px);
    }

    .link-icon {
      font-size: 2.5rem;
    }

    .link-card h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .link-card p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .loading {
      text-align: center;
      color: #666;
      padding: 3rem;
    }

    @media (max-width: 768px) {
      .event-card {
        grid-template-columns: 1fr;
      }

      .event-poster {
        height: 150px;
      }
    }
  `]
})
export class OrganizerDashboardComponent implements OnInit {
  currentUser: any;
  myEvents: Event[] = [];
  filteredEvents: Event[] = [];
  activeFilter: 'all' | 'upcoming' | 'draft' = 'all';
  loading = true;

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadMyEvents();
  }

  loadMyEvents(): void {
    if (this.currentUser) {
      this.eventService.getEventsByOrganizer(this.currentUser.id).subscribe({
        next: (events) => {
          this.myEvents = events;
          this.applyFilter();
          this.loading = false;
        }
      });
    }
  }

  setFilter(filter: 'all' | 'upcoming' | 'draft'): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    switch (this.activeFilter) {
      case 'upcoming':
        this.filteredEvents = this.myEvents.filter(e => 
          e.status === 'PUBLISHED' && new Date(e.date) >= new Date()
        );
        break;
      case 'draft':
        this.filteredEvents = this.myEvents.filter(e => e.status === 'DRAFT');
        break;
      default:
        this.filteredEvents = this.myEvents;
    }
  }

  getTotalBookings(): number {
    return Math.floor(Math.random() * 500) + 100; // Mock data
  }

  getTotalRevenue(): string {
    return (Math.floor(Math.random() * 50000) + 10000).toLocaleString();
  }

  getUpcomingEvents(): number {
    return this.myEvents.filter(e => 
      e.status === 'PUBLISHED' && new Date(e.date) >= new Date()
    ).length;
  }
}
