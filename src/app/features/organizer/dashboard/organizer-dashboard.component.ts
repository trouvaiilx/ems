// src/app/features/organizer/dashboard/organizer-dashboard.component.ts - UPDATED

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { OrganizerService, OrganizerStats } from '../../../core/services/organizer.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <div class="dashboard-header">
          <div>
            <h1 class="page-title">Organizer Dashboard</h1>
            <p class="page-subtitle">Welcome back, {{ currentUser?.fullName }}</p>
          </div>
          <a routerLink="/organizer/events/create" class="btn btn-primary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Create New Event
          </a>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-label">My Events</div>
              <div class="stat-value">{{ myEvents.length }}</div>
              <div class="stat-change positive">
                <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ getUpcomingEvents() }} upcoming</span>
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
              <div class="stat-value">{{ getTotalBookings() }}</div>
              <div class="stat-change positive">
                <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>+{{ stats?.thisMonth?.bookings || 0 }} this month</span>
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
              <div class="stat-value">RM {{ getTotalRevenue() }}</div>
              <div class="stat-change positive">
                <svg class="change-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>+RM {{ (stats?.thisMonth?.revenue || 0).toLocaleString() }} this month</span>
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

          <div class="stat-card">
            <div class="stat-content">
              <div class="stat-label">Active Events</div>
              <div class="stat-value">{{ getUpcomingEvents() }}</div>
              <div class="stat-change">
                <span>Next: {{ getNextEventDate() }}</span>
              </div>
            </div>
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Quick Actions Section -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-grid">
            <a routerLink="/organizer/events/create" class="action-card">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div class="action-content">
                <h4>Create Event</h4>
                <p>Setup a new event</p>
              </div>
            </a>
            <a routerLink="/organizer/analytics" class="action-card">
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
                <h4>Analytics</h4>
                <p>View event performance</p>
              </div>
            </a>
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
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading events...</p>
          </div>
          } @else if (filteredEvents.length > 0) {
          <div class="events-grid">
            @for (event of filteredEvents; track event.id) {
            <article class="event-card">
              @if (event.posterUrl) {
              <div
                class="event-poster"
                [style.background-image]="'url(' + event.posterUrl + ')'"
              ></div>
              } @else {
              <div class="event-poster placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              }
              <div class="event-content">
                <div class="event-header">
                  <h3>{{ event.name }}</h3>
                  <span class="badge badge-{{ event.status.toLowerCase() }}">
                    {{ event.status }}
                  </span>
                </div>
                <p class="event-date">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ event.date | date : 'fullDate' }} • {{ event.time }}
                </p>
                <p class="event-description">{{ event.description }}</p>
                <div class="event-actions">
                  <a
                    [routerLink]="['/organizer/events', event.id, 'edit']"
                    class="btn btn-secondary"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                    Edit
                  </a>
                  <a
                    [routerLink]="['/organizer/events', event.id, 'tickets']"
                    class="btn btn-secondary"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z"
                      />
                    </svg>
                    Tickets
                  </a>
                  <a [routerLink]="['/events', event.id]" class="btn btn-outline">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    View
                  </a>
                </div>
              </div>
            </article>
            }
          </div>
          } @else {
          <div class="empty-state">
            <div class="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3>No Events Found</h3>
            <p>Start by creating your first event</p>
            <a routerLink="/organizer/events/create" class="btn btn-primary">Create Event</a>
          </div>
          }
        </div>
        <!-- Change Password Modal -->
        @if (showChangePasswordModal) {
        <div class="modal-overlay">
          <div class="modal-content">
            <h2>Change Password Required</h2>
            <p>For security, please change your temporary password to continue.</p>

            <form (ngSubmit)="onChangePassword()" #pwForm="ngForm">
              <div class="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  [(ngModel)]="passwordData.currentPassword"
                  name="currentPassword"
                  required
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  [(ngModel)]="passwordData.newPassword"
                  name="newPassword"
                  required
                  minlength="6"
                  class="form-control"
                />
              </div>

              <button type="submit" class="btn btn-primary" [disabled]="!pwForm.form.valid">
                Update Password
              </button>
            </form>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        background: var(--neutral-white);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
      }
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
        flex-wrap: wrap;
        gap: 1rem;
      }

      .page-title {
        font-size: 2.5rem;
        color: var(--primary-900);
        margin: 0 0 0.5rem 0;
        line-height: 1.2;
      }

      .page-subtitle {
        color: var(--primary-600);
        font-size: 1.125rem;
        margin: 0;
      }

      .dashboard-header .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .dashboard-header .btn svg {
        width: 1.25rem;
        height: 1.25rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
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
        color: var(--primary-600);
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

      .content-section {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
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
        color: var(--primary-900);
        font-size: 1.5rem;
      }

      .filter-tabs {
        display: flex;
        gap: 0.5rem;
      }

      .tab-btn {
        padding: 0.5rem 1.5rem;
        border: 2px solid var(--primary-200);
        background: var(--neutral-white);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-weight: 600;
        color: var(--primary-700);
        font-size: 0.9375rem;
      }

      .tab-btn:hover {
        border-color: var(--accent-500);
        color: var(--accent-600);
      }

      .tab-btn.active {
        background: var(--accent-600);
        color: var(--neutral-white);
        border-color: var(--accent-600);
      }

      .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .event-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        transition: all var(--transition-base);
        display: flex;
        flex-direction: row-reverse; /* Details Left, Image Right */
        align-items: stretch;
      }

      .event-card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-4px);
      }

      .event-poster {
        width: 200px; /* Fixed width */
        height: auto; /* Stretch height */
        background-size: cover;
        background-position: center;
        position: relative;
        flex-shrink: 0;
      }

      .event-poster.placeholder {
        background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-600) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .event-poster.placeholder svg {
        width: 3rem;
        height: 3rem;
        color: var(--neutral-white);
        stroke-width: 2;
      }

      .event-content {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0; /* Prevent flex overflow */
      }

      .event-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }

      .event-header h3 {
        font-size: 1.25rem;
        color: var(--primary-900);
        margin: 0;
        flex: 1;
        line-height: 1.3;
      }

      .event-date {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent-600);
        font-weight: 500;
        font-size: 0.875rem;
        margin: 0 0 0.75rem 0;
      }

      .event-date svg {
        width: 1rem;
        height: 1rem;
      }

      .event-description {
        color: var(--primary-700);
        margin: 0 0 1.25rem 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
        font-size: 0.9375rem;
      }

      .event-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: auto;
        padding-top: 1rem;
      }

      .event-actions .btn {
        flex: 1;
        min-width: fit-content;
        justify-content: center;
        font-size: 0.8125rem;
        padding: 0.625rem 0.875rem;
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
      }

      .event-actions .btn svg {
        width: 0.875rem;
        height: 0.875rem;
      }

      @media (max-width: 640px) {
        .dashboard-header {
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
        }

        .dashboard-header .btn {
          justify-content: center;
        }

        .event-card {
          flex-direction: row-reverse; /* Maintain layout on mobile */
          min-height: auto;
        }

        .event-poster {
          height: auto;
          width: 120px; /* Smaller image width on mobile */
          border-radius: 0;
          margin-right: 0;
        }

        .event-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .filter-tabs {
          width: 100%;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 0.5rem;
          justify-content: flex-start; /* Align left for scroll */
        }
      }

      .loading-state {
        text-align: center;
        padding: 4rem 2rem;
      }

      .loading-state .spinner {
        width: 50px;
        height: 50px;
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
        margin-top: 1.5rem;
        font-size: 0.9375rem;
      }

      .empty-state {
        text-align: center;
        padding: 5rem 2rem;
      }

      .empty-state-icon {
        width: 5rem;
        height: 5rem;
        margin: 0 auto 1.5rem;
        background: var(--primary-200);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .empty-state-icon svg {
        width: 3rem;
        height: 3rem;
        color: var(--primary-600);
        stroke-width: 1.5;
      }

      .empty-state h3 {
        color: var(--primary-900);
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
      }

      .empty-state p {
        color: var(--primary-600);
        margin: 0 0 2rem 0;
        font-size: 1.0625rem;
      }

      .quick-links {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        margin-bottom: 2rem;
      }

      .quick-links h2 {
        margin: 0 0 1.5rem 0;
        color: var(--primary-900);
        font-size: 1.25rem;
      }

      .quick-actions {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        margin-bottom: 2rem;
      }

      .quick-actions h2 {
        margin: 0 0 1.5rem 0;
        color: var(--primary-900);
        font-size: 1.25rem;
      }

      .action-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .action-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        border: 2px solid var(--primary-200);
        border-radius: var(--radius-lg);
        text-decoration: none;
        transition: all var(--transition-fast);
      }

      .action-card:hover {
        border-color: var(--accent-500);
        background: var(--primary-100);
        transform: translateY(-2px);
      }

      .action-card .action-icon {
        width: 3rem;
        height: 3rem;
        background: var(--accent-300);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .action-card .action-icon svg {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--accent-800);
        stroke-width: 2;
      }

      .action-card .action-content h4 {
        margin: 0 0 0.25rem 0;
        color: var(--primary-900);
        font-size: 1rem;
      }

      .action-card .action-content p {
        margin: 0;
        color: var(--primary-600);
        font-size: 0.875rem;
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
        border: 2px solid var(--primary-200);
        border-radius: var(--radius-lg);
        text-decoration: none;
        transition: all var(--transition-fast);
      }

      .link-card:hover {
        border-color: var(--accent-500);
        background: var(--primary-100);
        transform: translateX(5px);
      }

      .link-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
      }

      .link-card h4 {
        margin: 0 0 0.25rem 0;
        color: var(--primary-900);
        font-size: 1rem;
      }

      .link-card p {
        margin: 0;
        color: var(--primary-600);
        font-size: 0.875rem;
      }

      /* Modal Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 400px;
        box-shadow: var(--shadow-xl);
      }

      .modal-content h2 {
        margin-top: 0;
        color: var(--primary-900);
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--primary-700);
        font-weight: 500;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 1rem;
      }

      .form-control:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px var(--accent-100);
      }

      @media (max-width: 968px) {
        .dashboard-page {
          padding: 1rem;
        }

        .dashboard-header {
          flex-direction: column;
          align-items: flex-start;
        }
        .page-title {
          font-size: 2rem;
        }

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .section-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .filter-tabs {
          width: 100%;
          flex-wrap: wrap;
        }

        .tab-btn {
          flex: 1;
          min-width: fit-content;
        }

        .events-grid {
          grid-template-columns: 1fr;
        }

        .event-actions {
          flex-direction: column;
          gap: 0.75rem;
        }

        .event-actions .btn {
          width: 100%;
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        .stat-card {
          flex-direction: column;
          text-align: center;
        }

        .stat-icon {
          margin: 0 auto 1rem;
        }

        .stat-value {
          font-size: 1.75rem;
        }

        .event-header {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class OrganizerDashboardComponent implements OnInit {
  currentUser: any;
  myEvents: Event[] = [];
  filteredEvents: Event[] = [];
  loading = true;
  activeFilter: 'all' | 'upcoming' | 'draft' = 'all';
  stats: OrganizerStats | null = null;

  // Modal State
  showChangePasswordModal = false;
  passwordData = {
    currentPassword: '',
    newPassword: '',
  };

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private organizerService: OrganizerService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Check for first login
    if (this.currentUser?.isFirstLogin) {
      this.showChangePasswordModal = true;
    }

    this.loadMyEvents();
    this.loadStats();
  }

  loadStats(): void {
    this.organizerService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => console.error('Failed to load stats', err),
    });
  }

  loadMyEvents(): void {
    // ... existing load logic
    if (this.currentUser) {
      this.eventService.getEventsByOrganizer(this.currentUser.id).subscribe({
        next: (events) => {
          this.myEvents = events;
          this.setFilter('all');
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    }
  }

  setFilter(filter: 'all' | 'upcoming' | 'draft'): void {
    this.activeFilter = filter;
    const now = new Date();

    if (filter === 'all') {
      this.filteredEvents = this.myEvents;
    } else if (filter === 'upcoming') {
      this.filteredEvents = this.myEvents.filter((e) => new Date(e.date) >= now);
    } else {
      // emerging pattern for drafts if status exists, otherwise just all else
      this.filteredEvents = this.myEvents.filter((e) => e.status === 'DRAFT');
    }
  }

  getTotalBookings(): number {
    return this.stats?.totalBookings || 0;
  }

  getTotalRevenue(): string {
    return (this.stats?.totalRevenue || 0).toLocaleString();
  }

  getUpcomingEvents(): number {
    return this.myEvents.filter((e) => new Date(e.date) >= new Date()).length;
  }

  getNextEventDate(): string {
    const upcoming = this.myEvents
      .filter((e) => e.status === 'PUBLISHED' && new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (upcoming.length > 0) {
      return new Date(upcoming[0].date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
    return 'None scheduled';
  }

  onChangePassword(): void {
    if (this.passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    this.authService.changePassword(this.passwordData).subscribe({
      next: () => {
        this.showChangePasswordModal = false;
        // Update local user state
        if (this.currentUser) {
          this.currentUser.isFirstLogin = false;
        }
        alert('Password changed successfully');
      },
      error: (err) => {
        alert(err.message || 'Failed to change password');
      },
    });
  }
}
