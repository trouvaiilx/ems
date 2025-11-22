// src/app/features/attendee/waitlist/waitlist.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WaitlistService } from '../../../core/services/waitlist.service';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-waitlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="waitlist-page">
      <div class="container">
        @if (event) {
        <div class="page-header">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1>Join Event Waitlist</h1>
          <p>Get notified when tickets become available</p>
        </div>

        <div class="content-grid">
          <div class="main-content">
            <div class="event-card">
              <div class="event-header">
                <h2>{{ event.name }}</h2>
                <span class="sold-out-badge">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Sold Out
                </span>
              </div>
              <div class="event-details">
                <div class="detail-row">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ event.date | date : 'fullDate' }}</span>
                </div>
                <div class="detail-row">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ event.time }}</span>
                </div>
                <div class="detail-row">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ event.organizerName }}</span>
                </div>
              </div>
            </div>

            @if (!alreadyOnWaitlist && !joinSuccess) {
            <div class="waitlist-form-card">
              <div class="card-header">
                <h3>Contact Information</h3>
                <p>We'll notify you when tickets become available</p>
              </div>
              <form (ngSubmit)="joinWaitlist()" class="waitlist-form">
                <div class="form-group">
                  <label for="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    [(ngModel)]="email"
                    name="email"
                    required
                    placeholder="your.email@example.com"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    [(ngModel)]="phone"
                    name="phone"
                    required
                    placeholder="+60123456789"
                    class="form-input"
                  />
                </div>

                @if (errorMessage) {
                <div class="alert alert-error">
                  <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ errorMessage }}</span>
                </div>
                }

                <button type="submit" class="btn btn-primary btn-block" [disabled]="processing">
                  @if (processing) {
                  <span class="spinner-sm"></span>
                  }
                  <span>{{ processing ? 'Joining Waitlist...' : 'Join Waitlist' }}</span>
                </button>
              </form>
            </div>
            } @if (alreadyOnWaitlist && !joinSuccess) {
            <div class="status-card already-joined">
              <div class="status-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3>You're Already on the Waitlist</h3>
              <p>
                We'll notify you at <strong>{{ email }}</strong> when tickets become available.
              </p>
              <div class="waitlist-position">
                <span class="label">Your Position:</span>
                <span class="position">#{{ waitlistPosition }}</span>
              </div>
              <button (click)="leaveWaitlist()" class="btn btn-outline" [disabled]="processing">
                Leave Waitlist
              </button>
            </div>
            } @if (joinSuccess) {
            <div class="status-card success">
              <div class="status-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <h3>Successfully Joined Waitlist!</h3>
              <p>
                We'll send you a notification at <strong>{{ email }}</strong> when tickets become
                available.
              </p>
              <div class="waitlist-position">
                <span class="label">Your Position:</span>
                <span class="position">#{{ waitlistPosition }}</span>
              </div>
              <div class="action-buttons">
                <a [routerLink]="['/events', event.id]" class="btn btn-outline"> Back to Event </a>
                <a routerLink="/events" class="btn btn-primary">Browse Other Events</a>
              </div>
            </div>
            }
          </div>

          <div class="sidebar">
            <div class="info-card">
              <div class="card-header">
                <h3>How Waitlist Works</h3>
              </div>
              <div class="card-content">
                <div class="info-steps">
                  <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h4>Join the Waitlist</h4>
                      <p>Provide your contact details to join</p>
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h4>Get Notified</h4>
                      <p>We'll email you when tickets are available</p>
                    </div>
                  </div>
                  <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h4>Book Your Tickets</h4>
                      <p>Complete your booking within the time limit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-card">
              <div class="card-header">
                <h3>Waitlist Statistics</h3>
              </div>
              <div class="card-content">
                <div class="stat-row">
                  <span class="stat-label">Current Waitlist</span>
                  <span class="stat-value">{{ currentWaitlistSize }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Max Capacity</span>
                  <span class="stat-value">{{ maxWaitlistSize }}</span>
                </div>
                @if (currentWaitlistSize >= maxWaitlistSize) {
                <div class="alert alert-warning">
                  <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>Waitlist is full</span>
                </div>
                }
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .waitlist-page {
        min-height: 100vh;
        background: var(--primary-100);
        padding: 2rem 1rem 4rem;
      }

      .page-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .header-icon {
        width: 4rem;
        height: 4rem;
        margin: 0 auto 1.5rem;
        background: var(--warning-100);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .header-icon svg {
        width: 2.5rem;
        height: 2.5rem;
        color: var(--warning-600);
        stroke-width: 2;
      }

      .page-header h1 {
        font-size: 2.5rem;
        color: var(--primary-900);
        margin-bottom: 0.5rem;
      }

      .page-header p {
        color: var(--primary-600);
        font-size: 1.125rem;
        margin: 0;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .event-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        padding: 2rem;
        margin-bottom: 1.5rem;
      }

      .event-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--primary-200);
      }

      .event-header h2 {
        font-size: 1.5rem;
        color: var(--primary-900);
        margin: 0;
        flex: 1;
      }

      .sold-out-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--error-100);
        color: var(--error-700);
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .sold-out-badge svg {
        width: 1.125rem;
        height: 1.125rem;
      }

      .event-details {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
      }

      .detail-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--primary-700);
        font-size: 0.9375rem;
      }

      .detail-row svg {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--primary-500);
        flex-shrink: 0;
      }

      .waitlist-form-card {
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

      .card-header h3 {
        font-size: 1.25rem;
        color: var(--primary-900);
        margin: 0 0 0.5rem 0;
      }

      .card-header p {
        color: var(--primary-600);
        font-size: 0.875rem;
        margin: 0;
      }

      .waitlist-form {
        padding: 2rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--primary-900);
        font-size: 0.875rem;
      }

      .form-input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all var(--transition-fast);
      }

      .form-input:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .status-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        padding: 3rem 2rem;
        text-align: center;
      }

      .status-icon {
        width: 4rem;
        height: 4rem;
        margin: 0 auto 1.5rem;
        background: var(--success-100);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .status-card.already-joined .status-icon {
        background: var(--accent-300);
      }

      .status-icon svg {
        width: 2.5rem;
        height: 2.5rem;
        color: var(--success-600);
      }

      .status-card.already-joined .status-icon svg {
        color: var(--accent-800);
      }

      .status-card h3 {
        font-size: 1.5rem;
        color: var(--primary-900);
        margin: 0 0 0.75rem 0;
      }

      .status-card p {
        color: var(--primary-600);
        font-size: 1rem;
        margin: 0 0 1.5rem 0;
        line-height: 1.6;
      }

      .waitlist-position {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        background: var(--primary-100);
        border-radius: var(--radius-lg);
        margin-bottom: 1.5rem;
      }

      .waitlist-position .label {
        color: var(--primary-700);
        font-size: 0.875rem;
        font-weight: 500;
      }

      .waitlist-position .position {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--accent-600);
      }

      .action-buttons {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
      }

      .info-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        overflow: hidden;
        margin-bottom: 1.5rem;
      }

      .card-content {
        padding: 1.75rem;
      }

      .info-steps {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .step {
        display: flex;
        gap: 1rem;
      }

      .step-number {
        width: 2.5rem;
        height: 2.5rem;
        background: var(--accent-600);
        color: var(--neutral-white);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1rem;
        flex-shrink: 0;
      }

      .step-content h4 {
        font-size: 0.9375rem;
        color: var(--primary-900);
        margin: 0 0 0.25rem 0;
      }

      .step-content p {
        font-size: 0.8125rem;
        color: var(--primary-600);
        margin: 0;
        line-height: 1.5;
      }

      .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.875rem 0;
        border-bottom: 1px solid var(--primary-200);
      }

      .stat-row:last-child {
        border-bottom: none;
      }

      .stat-label {
        color: var(--primary-600);
        font-size: 0.875rem;
        font-weight: 500;
      }

      .stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-900);
      }

      .alert {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-top: 1rem;
      }

      .alert-error {
        background: var(--error-100);
        border: 1px solid var(--error-600);
        color: var(--error-700);
      }

      .alert-warning {
        background: var(--warning-100);
        border: 1px solid var(--warning-600);
        color: var(--warning-700);
      }

      .alert-icon {
        width: 1.125rem;
        height: 1.125rem;
        flex-shrink: 0;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
        font-size: 0.9375rem;
        text-decoration: none;
      }

      .btn-block {
        width: 100%;
      }

      .btn-primary {
        background: var(--accent-600);
        color: var(--neutral-white);
      }

      .btn-primary:hover:not(:disabled) {
        background: var(--accent-700);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      .btn-outline {
        background: transparent;
        border: 2px solid var(--primary-300);
        color: var(--primary-700);
      }

      .btn-outline:hover:not(:disabled) {
        background: var(--primary-100);
        border-color: var(--accent-500);
        color: var(--accent-600);
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner-sm {
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 968px) {
        .content-grid {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class WaitlistComponent implements OnInit {
  event: Event | undefined;
  email = '';
  phone = '';
  processing = false;
  errorMessage = '';
  alreadyOnWaitlist = false;
  joinSuccess = false;
  waitlistPosition = 0;
  currentWaitlistSize = 0;
  maxWaitlistSize = 100;
  waitlistId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private waitlistService: WaitlistService,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
      this.checkWaitlistStatus(eventId);
      this.loadWaitlistSize(eventId);
    }

    // Pre-fill user data if logged in
    const user = this.authService.getCurrentUser();
    if (user) {
      this.email = user.email;
      this.phone = user.phoneNumber;
    }
  }

  loadEvent(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
      },
    });
  }

  checkWaitlistStatus(eventId: string): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.waitlistService.getWaitlistByEvent(eventId).subscribe({
      next: (waitlist) => {
        const userEntry = waitlist.find((w) => w.attendeeId === user.id);
        if (userEntry) {
          this.alreadyOnWaitlist = true;
          this.waitlistId = userEntry.id;
          this.waitlistPosition = waitlist.indexOf(userEntry) + 1;
          this.email = userEntry.attendeeEmail;
          this.phone = userEntry.attendeePhone;
        }
      },
    });
  }

  loadWaitlistSize(eventId: string): void {
    this.waitlistService.getWaitlistByEvent(eventId).subscribe({
      next: (waitlist) => {
        this.currentWaitlistSize = waitlist.length;
      },
    });
  }

  joinWaitlist(): void {
    if (!this.event) return;

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/waitlist/${this.event.id}` },
      });
      return;
    }

    if (!this.email || !this.phone) {
      this.errorMessage = 'Please provide both email and phone number';
      return;
    }

    this.processing = true;
    this.errorMessage = '';

    this.waitlistService.joinWaitlist(this.event.id, user.id, this.email, this.phone).subscribe({
      next: (entry) => {
        this.alreadyOnWaitlist = false; // Set to false to hide the "already on" card
        this.joinSuccess = true;
        this.waitlistId = entry.id;
        this.loadWaitlistSize(this.event!.id);
        this.waitlistService.getWaitlistByEvent(this.event!.id).subscribe({
          next: (waitlist) => {
            this.waitlistPosition = waitlist.findIndex((w) => w.id === entry.id) + 1;
          },
        });
        this.processing = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to join waitlist';
        this.processing = false;
      },
    });
  }

  leaveWaitlist(): void {
    if (!confirm('Are you sure you want to leave the waitlist?')) return;

    this.processing = true;

    this.waitlistService.leaveWaitlist(this.waitlistId).subscribe({
      next: () => {
        this.alreadyOnWaitlist = false;
        this.joinSuccess = false;
        this.processing = false;
        if (this.event) {
          this.loadWaitlistSize(this.event.id);
        }
      },
      error: () => {
        this.processing = false;
      },
    });
  }
}
