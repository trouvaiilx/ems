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
          <div class="success-banner">
            <span class="icon">✓</span>
            <div>
              <h3>Payment Successful!</h3>
              <p>Your tickets have been confirmed and sent to your email.</p>
            </div>
          </div>
        }

        <div class="page-header">
          <h1>My Tickets</h1>
          <p>View and manage your event bookings</p>
        </div>

        <div class="filter-tabs">
          <button 
            class="tab-btn"
            [class.active]="activeTab === 'upcoming'"
            (click)="setTab('upcoming')"
          >
            Upcoming
          </button>
          <button 
            class="tab-btn"
            [class.active]="activeTab === 'past'"
            (click)="setTab('past')"
          >
            Past Events
          </button>
          <button 
            class="tab-btn"
            [class.active]="activeTab === 'cancelled'"
            (click)="setTab('cancelled')"
          >
            Cancelled
          </button>
        </div>

        @if (loading) {
          <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading your tickets...</p>
          </div>
        } @else if (filteredBookings.length > 0) {
          <div class="tickets-list">
            @for (booking of filteredBookings; track booking.id) {
              <div class="ticket-card">
                <div class="ticket-header">
                  <div class="event-info">
                    <h3>{{ booking.eventName }}</h3>
                    <p class="booking-date">Booked on {{ booking.bookingDate | date:'mediumDate' }}</p>
                  </div>
                  <span class="status-badge" [class]="booking.status.toLowerCase()">
                    {{ booking.status }}
                  </span>
                </div>

                <div class="ticket-details">
                  <div class="detail-row">
                    <span class="label">Booking ID:</span>
                    <span class="value">{{ booking.id }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Tickets:</span>
                    <span class="value">{{ booking.tickets.length }} ticket(s)</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Total Amount:</span>
                    <span class="value amount">RM {{ booking.finalAmount }}</span>
                  </div>
                  @if (booking.promoCode) {
                    <div class="detail-row">
                      <span class="label">Promo Applied:</span>
                      <span class="value promo">{{ booking.promoCode }} (-RM {{ booking.discountApplied }})</span>
                    </div>
                  }
                </div>

                @if (booking.status === 'CONFIRMED' && !booking.checkedIn) {
                  <div class="qr-section">
                    <div class="qr-code">
                      <div class="qr-placeholder">
                        <span class="qr-icon">▦</span>
                        <p>{{ booking.qrCode }}</p>
                      </div>
                    </div>
                    <div class="qr-info">
                      <h4>Your Entry Pass</h4>
                      <p>Show this QR code at the venue entrance</p>
                      <button class="btn btn-secondary" (click)="downloadTicket(booking)">
                        📥 Download Ticket
                      </button>
                    </div>
                  </div>
                }

                @if (booking.checkedIn) {
                  <div class="checked-in-badge">
                    <span class="icon">✓</span>
                    <span>Checked In on {{ booking.checkedInAt | date:'medium' }}</span>
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
                  <h4>Seat Details:</h4>
                  <div class="seats-grid">
                    @for (ticket of booking.tickets; track ticket.seatNumber) {
                      <div class="seat-badge">
                        <span class="seat-icon">💺</span>
                        <div>
                          <p class="seat-number">{{ ticket.seatNumber }}</p>
                          <p class="seat-type">{{ getCategoryName(ticket.category) }}</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <div class="empty-icon">🎫</div>
            <h3>No Tickets Found</h3>
            <p>You don't have any {{ activeTab }} bookings.</p>
            <a routerLink="/events" class="btn btn-primary">Browse Events</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .my-tickets-page {
      min-height: 100vh;
      background: #f9fafb;
      padding: 2rem;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .success-banner {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 2rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
      animation: slideDown 0.5s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .success-banner .icon {
      width: 60px;
      height: 60px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .success-banner h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .success-banner p {
      margin: 0;
      opacity: 0.9;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .page-header p {
      color: #666;
      margin: 0;
    }

    .filter-tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      background: white;
      padding: 1rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .tab-btn {
      flex: 1;
      padding: 0.75rem 1.5rem;
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

    .tickets-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .ticket-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s;
    }

    .ticket-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .ticket-header {
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: start;
    }

    .event-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .booking-date {
      margin: 0;
      opacity: 0.9;
      font-size: 0.875rem;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      background: rgba(255,255,255,0.3);
    }

    .status-badge.confirmed {
      background: rgba(255,255,255,0.95);
      color: #059669;
    }

    .status-badge.cancelled {
      background: rgba(255,255,255,0.95);
      color: #dc2626;
    }

    .ticket-details {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      color: #666;
      font-size: 0.875rem;
    }

    .value {
      font-weight: 600;
      color: #333;
    }

    .value.amount {
      font-size: 1.25rem;
      color: #6366f1;
    }

    .value.promo {
      color: #059669;
    }

    .qr-section {
      padding: 2rem;
      background: #f9fafb;
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2rem;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
    }

    .qr-code {
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 2px dashed #6366f1;
    }

    .qr-placeholder {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .qr-icon {
      font-size: 4rem;
      color: #6366f1;
      margin-bottom: 0.5rem;
    }

    .qr-placeholder p {
      margin: 0;
      font-size: 0.75rem;
      color: #666;
      font-family: monospace;
    }

    .qr-info h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .qr-info p {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .checked-in-badge {
      padding: 1.5rem 2rem;
      background: #d1fae5;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .checked-in-badge .icon {
      width: 40px;
      height: 40px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .checked-in-badge span:not(.icon) {
      color: #065f46;
      font-weight: 600;
    }

    .ticket-actions {
      padding: 2rem;
      display: flex;
      gap: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .ticket-seats {
      padding: 2rem;
    }

    .ticket-seats h4 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .seats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .seat-badge {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 2px solid #e5e7eb;
    }

    .seat-icon {
      font-size: 1.5rem;
    }

    .seat-number {
      margin: 0 0 0.25rem 0;
      font-weight: 700;
      color: #333;
      font-size: 1.125rem;
    }

    .seat-type {
      margin: 0;
      color: #666;
      font-size: 0.75rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
      text-align: center;
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

    .btn-danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .btn-danger:hover {
      background: #dc2626;
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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

    .loading-container {
      text-align: center;
      padding: 5rem 2rem;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .qr-section {
        grid-template-columns: 1fr;
      }

      .ticket-actions {
        flex-direction: column;
      }

      .filter-tabs {
        flex-direction: column;
      }
    }
  `]
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
    // Check for success message from payment
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true') {
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
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
      }
    });
  }

  setTab(tab: 'upcoming' | 'past' | 'cancelled'): void {
    this.activeTab = tab;
    this.filterBookings();
  }

  filterBookings(): void {
    const now = new Date();
    
    switch (this.activeTab) {
      case 'upcoming':
        this.filteredBookings = this.bookings.filter(b => 
          b.status === 'CONFIRMED' && !b.checkedIn
        );
        break;
      case 'past':
        this.filteredBookings = this.bookings.filter(b => 
          b.status === 'COMPLETED' || b.checkedIn
        );
        break;
      case 'cancelled':
        this.filteredBookings = this.bookings.filter(b => 
          b.status === 'CANCELLED'
        );
        break;
    }
  }

  getCategoryName(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  canCancel(booking: Booking): boolean {
    // Can cancel if more than 7 days before event
    // This is a simplified check - in real app would check actual event date
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
        }
      });
    }
  }

  downloadTicket(booking: Booking): void {
    // Mock download - in real app would generate PDF
    alert('Ticket download feature - PDF would be generated here');
  }
}
