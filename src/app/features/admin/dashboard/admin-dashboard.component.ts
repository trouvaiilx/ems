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
            <h1 class="page-title">Admin Dashboard</h1>
            <p class="page-subtitle">Welcome back, {{ currentUser?.fullName }}</p>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-label">Event Organizers</div>
              <div class="stat-value">{{ totalOrganizers }}</div>
              <div class="stat-change positive">
                <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>+12% from last month</span>
              </div>
            </div>
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-label">Total Events</div>
              <div class="stat-value">{{ totalEvents }}</div>
              <div class="stat-change positive">
                <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>+8% from last month</span>
              </div>
            </div>
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-label">Total Bookings</div>
              <div class="stat-value">{{ totalBookings }}</div>
              <div class="stat-change positive">
                <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>+15% from last month</span>
              </div>
            </div>
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-label">Total Revenue</div>
              <div class="stat-value">RM {{ totalRevenue.toLocaleString() }}</div>
              <div class="stat-change positive">
                <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>+22% from last month</span>
              </div>
            </div>
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <div class="card">
            <div class="card-header">
              <h2>Quick Actions</h2>
            </div>
            <div class="card-content">
              <div class="action-list">
                <a routerLink="/admin/register-organizer" class="action-item">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                  <div class="action-content">
                    <h4>Register Organizer</h4>
                    <p>Add new event organizer account</p>
                  </div>
                  <svg class="action-arrow" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a routerLink="/admin/analytics" class="action-item">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div class="action-content">
                    <h4>View Analytics</h4>
                    <p>Auditorium usage reports</p>
                  </div>
                  <svg class="action-arrow" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a routerLink="/events" class="action-item">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                  <div class="action-content">
                    <h4>All Events</h4>
                    <p>View all upcoming events</p>
                  </div>
                  <svg class="action-arrow" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h2>Recent Events</h2>
            </div>
            <div class="card-content">
              @if (loading) {
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading...</p>
              </div>
              } @else if (recentEvents.length > 0) {
              <div class="event-list">
                @for (event of recentEvents; track event.id) {
                <div class="event-item-small">
                  <div class="event-icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div class="event-details-small">
                    <h4>{{ event.name }}</h4>
                    <p>{{ event.organizerName }} • {{ event.date | date : 'mediumDate' }}</p>
                    <span class="badge badge-{{ event.status.toLowerCase() }}">{{
                      event.status
                    }}</span>
                  </div>
                </div>
                }
              </div>
              } @else {
              <p class="empty-text">No recent events</p>
              }
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>System Status</h2>
          </div>
          <div class="card-content">
            <div class="status-grid">
              <div class="status-item">
                <div class="status-indicator success"></div>
                <div class="status-content">
                  <h4>System Health</h4>
                  <p>All systems operational</p>
                </div>
              </div>
              <div class="status-item">
                <div class="status-indicator success"></div>
                <div class="status-content">
                  <h4>Database</h4>
                  <p>Connected and responsive</p>
                </div>
              </div>
              <div class="status-item">
                <div class="status-indicator success"></div>
                <div class="status-content">
                  <h4>Email Service</h4>
                  <p>Sending notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-page {
        min-height: 100vh;
        background: var(--primary-100);
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

      .page-title {
        font-size: 2.5rem;
        color: var(--primary-900);
        margin: 0 0 0.5rem 0;
      }

      .page-subtitle {
        color: var(--primary-600);
        font-size: 1.125rem;
        margin: 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        padding: 1.75rem;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        transition: all var(--transition-base);
      }

      .stat-card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
      }

      .stat-content {
        flex: 1;
      }

      .stat-label {
        color: var(--primary-600);
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-900);
        margin-bottom: 0.75rem;
        line-height: 1;
      }

      .stat-change {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.8125rem;
        font-weight: 500;
      }

      .stat-change.positive {
        color: var(--success-600);
      }

      .stat-change.negative {
        color: var(--error-600);
      }

      .change-icon {
        width: 1rem;
        height: 1rem;
      }

      .stat-icon {
        width: 3.5rem;
        height: 3.5rem;
        background: var(--accent-300);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stat-icon svg {
        width: 2rem;
        height: 2rem;
        color: var(--accent-800);
        stroke-width: 2;
      }

      .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        overflow: hidden;
      }

      .card-header {
        padding: 1.75rem;
        border-bottom: 1px solid var(--primary-200);
      }

      .card-header h2 {
        font-size: 1.25rem;
        color: var(--primary-900);
        margin: 0;
      }

      .card-content {
        padding: 1.75rem;
      }

      .action-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .action-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.25rem;
        border: 1px solid var(--primary-200);
        border-radius: var(--radius-lg);
        text-decoration: none;
        transition: all var(--transition-fast);
      }

      .action-item:hover {
        border-color: var(--accent-500);
        background: var(--primary-100);
        transform: translateX(4px);
      }

      .action-icon {
        width: 3rem;
        height: 3rem;
        background: var(--accent-300);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .action-icon svg {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--accent-800);
        stroke-width: 2;
      }

      .action-content {
        flex: 1;
      }

      .action-content h4 {
        font-size: 1rem;
        color: var(--primary-900);
        margin: 0 0 0.25rem 0;
      }

      .action-content p {
        font-size: 0.8125rem;
        color: var(--primary-600);
        margin: 0;
      }

      .action-arrow {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--primary-400);
        flex-shrink: 0;
        transition: transform var(--transition-fast);
      }

      .action-item:hover .action-arrow {
        transform: translateX(4px);
      }

      .event-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .event-item-small {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid var(--primary-200);
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
      }

      .event-item-small:hover {
        background: var(--primary-100);
      }

      .event-icon-circle {
        width: 2.5rem;
        height: 2.5rem;
        background: var(--primary-200);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .event-icon-circle svg {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--primary-700);
        stroke-width: 2;
      }

      .event-details-small {
        flex: 1;
        min-width: 0;
      }

      .event-details-small h4 {
        font-size: 0.9375rem;
        color: var(--primary-900);
        margin: 0 0 0.25rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .event-details-small p {
        font-size: 0.8125rem;
        color: var(--primary-600);
        margin: 0 0 0.5rem 0;
      }

      .status-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .status-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.25rem;
        border: 1px solid var(--primary-200);
        border-radius: var(--radius-lg);
      }

      .status-indicator {
        width: 0.875rem;
        height: 0.875rem;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .status-indicator.success {
        background: var(--success-600);
        box-shadow: 0 0 0 4px var(--success-100);
      }

      .status-indicator.warning {
        background: var(--warning-600);
        box-shadow: 0 0 0 4px var(--warning-100);
      }

      .status-indicator.error {
        background: var(--error-600);
        box-shadow: 0 0 0 4px var(--error-100);
      }

      .status-content h4 {
        font-size: 0.9375rem;
        color: var(--primary-900);
        margin: 0 0 0.25rem 0;
      }

      .status-content p {
        font-size: 0.8125rem;
        color: var(--primary-600);
        margin: 0;
      }

      .loading-state {
        text-align: center;
        padding: 3rem 2rem;
      }

      .loading-state .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--primary-300);
        border-top-color: var(--accent-600);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .loading-state p {
        color: var(--primary-600);
        margin-top: 1rem;
        font-size: 0.875rem;
      }

      .empty-text {
        text-align: center;
        color: var(--primary-600);
        padding: 2rem;
        margin: 0;
        font-size: 0.875rem;
      }

      @media (max-width: 768px) {
        .dashboard-page {
          padding: 1rem;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .content-grid {
          grid-template-columns: 1fr;
        }

        .page-title {
          font-size: 2rem;
        }

        .stat-value {
          font-size: 1.75rem;
        }
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;
  totalOrganizers = 15;
  totalEvents = 48;
  totalBookings = 1247;
  totalRevenue = 125480;
  recentEvents: any[] = [];
  loading = true;

  constructor(private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRecentEvents();
  }

  loadRecentEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.recentEvents = events.slice(0, 5);
        this.loading = false;
      },
    });
  }
}
