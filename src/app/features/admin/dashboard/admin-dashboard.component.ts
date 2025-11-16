// src/app/features/admin/dashboard/admin-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <div class="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {{ currentUser?.fullName }}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>{{ totalOrganizers }}</h3>
              <p>Event Organizers</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎭</div>
            <div class="stat-content">
              <h3>{{ totalEvents }}</h3>
              <p>Total Events</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎫</div>
            <div class="stat-content">
              <h3>{{ totalBookings }}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>RM {{ totalRevenue }}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-buttons">
              <a routerLink="/admin/register-organizer" class="action-btn">
                <span class="btn-icon">➕</span>
                <div>
                  <h4>Register Organizer</h4>
                  <p>Add new event organizer</p>
                </div>
              </a>
              <a routerLink="/admin/analytics" class="action-btn">
                <span class="btn-icon">📊</span>
                <div>
                  <h4>View Analytics</h4>
                  <p>Auditorium usage reports</p>
                </div>
              </a>
              <a routerLink="/events" class="action-btn">
                <span class="btn-icon">🎭</span>
                <div>
                  <h4>All Events</h4>
                  <p>View all upcoming events</p>
                </div>
              </a>
            </div>
          </div>

          <div class="recent-activity">
            <h2>Recent Events</h2>
            @if (loading) {
              <div class="loading">Loading...</div>
            } @else if (recentEvents.length > 0) {
              <div class="activity-list">
                @for (event of recentEvents; track event.id) {
                  <div class="activity-item">
                    <div class="activity-icon">🎭</div>
                    <div class="activity-content">
                      <h4>{{ event.name }}</h4>
                      <p>{{ event.organizerName }} • {{ event.date | date:'mediumDate' }}</p>
                      <span class="status-badge" [class]="event.status.toLowerCase()">
                        {{ event.status }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <p class="empty-message">No recent events</p>
            }
          </div>
        </div>

        <div class="system-status">
          <h2>System Status</h2>
          <div class="status-grid">
            <div class="status-item">
              <span class="status-indicator success"></span>
              <div>
                <h4>System Health</h4>
                <p>All systems operational</p>
              </div>
            </div>
            <div class="status-item">
              <span class="status-indicator success"></span>
              <div>
                <h4>Database</h4>
                <p>Connected and responsive</p>
              </div>
            </div>
            <div class="status-item">
              <span class="status-indicator success"></span>
              <div>
                <h4>Email Service</h4>
                <p>Sending notifications</p>
              </div>
            </div>
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
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .dashboard-header p {
      color: #666;
      margin: 0;
      font-size: 1.1rem;
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

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 968px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .quick-actions,
    .recent-activity,
    .system-status {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quick-actions h2,
    .recent-activity h2,
    .system-status h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.3s;
    }

    .action-btn:hover {
      border-color: #6366f1;
      background: #f9fafb;
      transform: translateX(5px);
    }

    .btn-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f1ff;
      border-radius: 0.5rem;
    }

    .action-btn h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .action-btn p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .activity-icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .activity-content h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
      font-size: 1rem;
    }

    .activity-content p {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .status-badge {
      display: inline-block;
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

    .status-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-indicator.success {
      background: #10b981;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
    }

    .status-item h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
      font-size: 1rem;
    }

    .status-item p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .loading,
    .empty-message {
      text-align: center;
      color: #666;
      padding: 2rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;
  totalOrganizers = 15;
  totalEvents = 48;
  totalBookings = 1247;
  totalRevenue = 125480;
  recentEvents: any[] = [];
  loading = true;

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRecentEvents();
  }

  loadRecentEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.recentEvents = events.slice(0, 5);
        this.loading = false;
      }
    });
  }
}
