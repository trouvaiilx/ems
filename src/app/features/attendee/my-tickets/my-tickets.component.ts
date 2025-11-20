// src/app/features/attendee/my-tickets/my-tickets.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking, BookingStatus } from '../../../core/models/booking.model';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="my-tickets-page">
      <div class="container">
        @if (showSuccessMessage) {
        <div class="alert alert-success">
          <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <h3>Payment Successful!</h3>
            <p>Your tickets have been confirmed and sent to your email.</p>
          </div>
        </div>
        }

        <div class="page-header">
          <h1 class="page-title">My Tickets</h1>
          <p class="page-subtitle">View and manage your event bookings</p>
        </div>

        <div class="filter-tabs">
          <button
            class="tab-btn"
            [class.active]="activeTab === 'upcoming'"
            (click)="setTab('upcoming')"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
            Upcoming
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'past'" (click)="setTab('past')">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
            Past Events
          </button>
          <button
            class="tab-btn"
            [class.active]="activeTab === 'cancelled'"
            (click)="setTab('cancelled')"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            Cancelled
          </button>
        </div>

        @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading your tickets...</p>
        </div>
        } @else if (filteredBookings.length > 0) {
        <div class="tickets-list">
          @for (booking of filteredBookings; track booking.id) {
          <article class="ticket-card">
            <div class="ticket-header">
              <div class="event-info">
                <h3>{{ booking.eventName }}</h3>
                <p class="booking-date">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Booked on {{ booking.bookingDate | date : 'mediumDate' }}
                </p>
              </div>
              <span class="badge badge-{{ booking.status.toLowerCase() }}">
                {{ booking.status }}
              </span>
            </div>

            <div class="ticket-details">
              <div class="detail-row">
                <span class="label">Booking ID</span>
                <span class="value">{{ booking.id }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tickets</span>
                <span class="value">{{ booking.tickets.length }} ticket(s)</span>
              </div>
              <div class="detail-row">
                <span class="label">Total Amount</span>
                <span class="value amount">RM {{ booking.finalAmount }}</span>
              </div>
              @if (booking.promoCode) {
              <div class="detail-row">
                <span class="label">Promo Applied</span>
                <span class="value promo"
                  >{{ booking.promoCode }} (-RM {{ booking.discountApplied }})</span
                >
              </div>
              }
            </div>

            @if (booking.status === 'CONFIRMED' && !booking.checkedIn) {
            <div class="qr-section">
              <div class="qr-code">
                <div class="qr-placeholder">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm14 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm2 4h2v2h-2v-2zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2z"
                    />
                  </svg>
                  <p>{{ booking.qrCode }}</p>
                </div>
              </div>
              <div class="qr-info">
                <h4>Your Entry Pass</h4>
                <p>Show this QR code at the venue entrance</p>
                <button class="btn btn-secondary" (click)="downloadTicket(booking)">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Download Ticket
                </button>
              </div>
            </div>
            } @if (booking.checkedIn) {
            <div class="checked-in-badge">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Checked In on {{ booking.checkedInAt | date : 'medium' }}</span>
            </div>
            }

            <div class="ticket-actions">
              <a [routerLink]="['/events', booking.eventId]" class="btn btn-outline">
                View Event Details
              </a>
              @if (booking.status === 'CONFIRMED' && canCancel(booking)) {
              <button (click)="cancelBooking(booking)" class="btn btn-danger">
                Cancel Booking
              </button>
              }
            </div>

            <div class="ticket-seats">
              <h4>Seat Details</h4>
              <div class="seats-grid">
                @for (ticket of booking.tickets; track ticket.seatNumber) {
                <div class="seat-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <div>
                    <p class="seat-number">{{ ticket.seatNumber }}</p>
                    <p class="seat-type">{{ getCategoryName(ticket.category) }}</p>
                  </div>
                </div>
                }
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
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <h3>No Tickets Found</h3>
          <p>You don't have any {{ activeTab }} bookings.</p>
          <a routerLink="/events" class="btn btn-primary">Browse Events</a>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .my-tickets-page {
        min-height: 100vh;
        background: var(--primary-100);
        padding: 2rem 1rem 4rem;
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .page-title {
        font-size: 2.5rem;
        color: var(--primary-900);
        margin-bottom: 0.5rem;
      }

      .page-subtitle {
        color: var(--primary-600);
        font-size: 1.125rem;
        margin: 0;
      }

      /* FIXED: Success Alert Icon Size */
      .alert {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.25rem;
        border-radius: var(--radius-lg);
        margin-bottom: 2rem;
        background: var(--success-100);
        border: 1px solid var(--success-600);
      }

      .alert-success {
        background: var(--success-100);
        border-color: var(--success-600);
      }

      .alert-icon {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--success-600);
        flex-shrink: 0;
        margin-top: 0.125rem;
      }

      .alert h3 {
        margin: 0 0 0.25rem 0;
        color: var(--success-700);
        font-size: 1rem;
      }

      .alert p {
        margin: 0;
        color: var(--success-700);
        font-size: 0.875rem;
      }

      .filter-tabs {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 2rem;
        background: var(--neutral-white);
        padding: 0.75rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
      }

      .tab-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.875rem 1.25rem;
        border: 1px solid var(--primary-200);
        background: transparent;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-weight: 500;
        color: var(--primary-700);
        font-size: 0.9375rem;
      }

      .tab-btn svg {
        width: 1.125rem;
        height: 1.125rem;
      }

      .tab-btn:hover {
        border-color: var(--accent-500);
        color: var(--accent-600);
        background: var(--primary-100);
      }

      .tab-btn.active {
        background: var(--accent-600);
        color: var(--neutral-white);
        border-color: var(--accent-600);
      }

      .tickets-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .ticket-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        overflow: hidden;
        border: 1px solid var(--primary-200);
        transition: all var(--transition-base);
      }

      .ticket-card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
      }

      .ticket-header {
        padding: 1.75rem;
        background: linear-gradient(135deg, var(--accent-700) 0%, var(--accent-900) 100%);
        color: var(--neutral-white);
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
      }

      .event-info h3 {
        font-size: 1.5rem;
        margin: 0 0 0.5rem 0;
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

      .booking-date {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.95;
      }

      .booking-date svg {
        width: 1rem;
        height: 1rem;
      }

      .badge {
        display: inline-block;
        padding: 0.375rem 0.875rem;
        border-radius: var(--radius-md);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }

      .badge-confirmed {
        background: var(--neutral-white);
        color: var(--success-700);
      }

      .badge-cancelled {
        background: var(--neutral-white);
        color: var(--error-700);
      }

      .badge-pending {
        background: var(--neutral-white);
        color: var(--warning-700);
      }

      .ticket-details {
        padding: 1.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        border-bottom: 1px solid var(--primary-200);
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .label {
        color: var(--primary-600);
        font-size: 0.875rem;
        font-weight: 500;
      }

      .value {
        font-weight: 600;
        color: var(--primary-900);
      }

      .value.amount {
        font-size: 1.25rem;
        color: var(--accent-600);
      }

      .value.promo {
        color: var(--success-600);
      }

      .qr-section {
        padding: 1.75rem;
        background: var(--primary-100);
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 2rem;
        align-items: center;
        border-bottom: 1px solid var(--primary-200);
      }

      .qr-code {
        background: var(--neutral-white);
        padding: 1rem;
        border-radius: var(--radius-md);
        border: 2px dashed var(--accent-600);
      }

      .qr-placeholder {
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--primary-100);
        border-radius: var(--radius-sm);
      }

      .qr-placeholder svg {
        width: 4rem;
        height: 4rem;
        color: var(--accent-600);
        margin-bottom: 0.5rem;
      }

      .qr-placeholder p {
        margin: 0;
        font-size: 0.6875rem;
        color: var(--primary-600);
        font-family: monospace;
        word-break: break-all;
        padding: 0 0.5rem;
        text-align: center;
      }

      .qr-info h4 {
        margin: 0 0 0.5rem 0;
        color: var(--primary-900);
        font-size: 1.125rem;
      }

      .qr-info p {
        margin: 0 0 1rem 0;
        color: var(--primary-600);
        font-size: 0.875rem;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
        font-size: 0.875rem;
        text-decoration: none;
      }

      .btn svg {
        width: 1rem;
        height: 1rem;
      }

      .btn-secondary {
        background: var(--primary-200);
        color: var(--primary-900);
      }

      .btn-secondary:hover {
        background: var(--primary-300);
      }

      .btn-outline {
        background: transparent;
        border: 1px solid var(--primary-300);
        color: var(--primary-700);
      }

      .btn-outline:hover {
        background: var(--primary-100);
        border-color: var(--accent-500);
        color: var(--accent-600);
      }

      .btn-danger {
        background: var(--error-100);
        color: var(--error-700);
        border: 1px solid var(--error-600);
      }

      .btn-danger:hover {
        background: var(--error-600);
        color: var(--neutral-white);
      }

      .btn-primary {
        background: var(--accent-600);
        color: var(--neutral-white);
      }

      .btn-primary:hover {
        background: var(--accent-700);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      .checked-in-badge {
        padding: 1.25rem 1.75rem;
        background: var(--success-100);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        border-bottom: 1px solid var(--primary-200);
      }

      .checked-in-badge svg {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--success-600);
        flex-shrink: 0;
      }

      .checked-in-badge span {
        color: var(--success-700);
        font-weight: 600;
        font-size: 0.9375rem;
      }

      .ticket-actions {
        padding: 1.75rem;
        display: flex;
        gap: 0.75rem;
        border-bottom: 1px solid var(--primary-200);
        flex-wrap: wrap;
      }

      .ticket-seats {
        padding: 1.75rem;
      }

      .ticket-seats h4 {
        margin: 0 0 1rem 0;
        color: var(--primary-900);
        font-size: 1rem;
      }

      .seats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 0.75rem;
      }

      .seat-badge {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem;
        background: var(--primary-100);
        border-radius: var(--radius-md);
        border: 1px solid var(--primary-200);
      }

      .seat-badge svg {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--primary-600);
        flex-shrink: 0;
        stroke-width: 2;
      }

      .seat-number {
        margin: 0 0 0.125rem 0;
        font-weight: 700;
        color: var(--primary-900);
        font-size: 1rem;
      }

      .seat-type {
        margin: 0;
        color: var(--primary-600);
        font-size: 0.75rem;
      }

      /* FIXED: Empty State Spacing */
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

      @media (max-width: 768px) {
        .qr-section {
          grid-template-columns: 1fr;
        }

        .filter-tabs {
          flex-direction: column;
        }

        .ticket-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class MyTicketsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  activeTab: 'upcoming' | 'past' | 'cancelled' = 'upcoming';
  loading = true;
  showSuccessMessage = false;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['success'] === 'true') {
        this.showSuccessMessage = true;
        setTimeout(() => (this.showSuccessMessage = false), 5000);
      }
    });

    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadBookings(user.id);
    }
  }

  loadBookings(attendeeId: string): void {
    this.bookingService.getBookingsByAttendee(attendeeId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.filterBookings();
        this.loading = false;
      },
    });
  }

  setTab(tab: 'upcoming' | 'past' | 'cancelled'): void {
    this.activeTab = tab;
    this.filterBookings();
  }

  filterBookings(): void {
    switch (this.activeTab) {
      case 'upcoming':
        this.filteredBookings = this.bookings.filter(
          (b) => b.status === 'CONFIRMED' && !b.checkedIn
        );
        break;
      case 'past':
        this.filteredBookings = this.bookings.filter(
          (b) => b.status === 'COMPLETED' || b.checkedIn
        );
        break;
      case 'cancelled':
        this.filteredBookings = this.bookings.filter((b) => b.status === 'CANCELLED');
        break;
    }
  }

  getCategoryName(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  canCancel(booking: Booking): boolean {
    return true;
  }

  cancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(booking.id).subscribe({
        next: () => {
          booking.status = BookingStatus.CANCELLED;
          this.filterBookings();
          alert('Booking cancelled successfully');
        },
        error: (error) => {
          alert(error.message || 'Unable to cancel booking');
        },
      });
    }
  }

  downloadTicket(booking: Booking): void {
    alert('Ticket download feature - QR Code would be generated here');
  }
}
