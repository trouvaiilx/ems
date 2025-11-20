// src/app/features/attendee/booking/booking.component.ts - Modern Professional Version (Part 1)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { TicketService } from '../../../core/services/ticket.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';
import { TicketType, TicketCategory, SeatingSection } from '../../../core/models/ticket.model';

interface SelectedTicket {
  ticketType: TicketType;
  quantity: number;
  seatNumbers: string[];
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="booking-page">
      <div class="container">
        @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading booking details...</p>
        </div>
        } @else if (event) {
        <div class="booking-header">
          <div class="header-content">
            <div class="breadcrumb">
              <a [routerLink]="['/events', event.id]">
                <svg class="breadcrumb-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                Back to Event
              </a>
            </div>
            <h1 class="page-title">Book Tickets</h1>
            <div class="event-info">
              <h2>{{ event.name }}</h2>
              <div class="event-meta">
                <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ event.date | date : 'fullDate' }} • {{ event.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="booking-grid">
          <div class="main-content">
            <div class="card">
              <div class="card-header">
                <h3>Select Tickets</h3>
                <p>Choose the number of tickets you need</p>
              </div>
              <div class="ticket-list">
                @for (ticket of tickets; track ticket.id) {
                <div class="ticket-selector">
                  <div class="ticket-info">
                    <h4>{{ getCategoryName(ticket.category) }}</h4>
                    <span class="section-badge">
                      <svg class="badge-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill-rule="evenodd"
                          d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      {{ ticket.section }}
                    </span>
                    <div class="price-info">
                      <span class="price">RM {{ ticket.price }}</span>
                      <span class="availability">{{ ticket.availableTickets }} available</span>
                    </div>
                  </div>
                  <div class="quantity-selector">
                    <button
                      class="qty-btn"
                      (click)="decreaseQuantity(ticket)"
                      [disabled]="getSelectedQuantity(ticket) === 0"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill-rule="evenodd"
                          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <input
                      type="number"
                      [value]="getSelectedQuantity(ticket)"
                      readonly
                      class="qty-input"
                    />
                    <button
                      class="qty-btn"
                      (click)="increaseQuantity(ticket)"
                      [disabled]="
                        getSelectedQuantity(ticket) >= ticket.availableTickets ||
                        getSelectedQuantity(ticket) >= 10
                      "
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                }
              </div>
            </div>

            @if (getTotalTickets() > 0) {
            <div class="card">
              <div class="card-header">
                <h3>Select Seats</h3>
                <p>Choose your preferred seats</p>
              </div>
              <div class="seat-selection">
                @for (selected of selectedTickets; track selected.ticketType.id) {
                <div class="seat-group">
                  <h4 class="seat-group-title">
                    {{ getCategoryName(selected.ticketType.category) }} -
                    {{ selected.ticketType.section }}
                  </h4>
                  <div class="seats-grid">
                    @for (seat of generateSeats(selected.ticketType.section, selected.quantity);
                    track seat) {
                    <button
                      class="seat-btn"
                      [class.selected]="isSeatSelected(selected.ticketType.id, seat)"
                      (click)="toggleSeat(selected.ticketType.id, seat)"
                    >
                      <svg class="seat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span>{{ seat }}</span>
                    </button>
                    }
                  </div>
                </div>
                }
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3>Promotional Code</h3>
                <p>Have a promo code? Apply it here</p>
              </div>
              <div class="promo-section">
                <input
                  type="text"
                  [(ngModel)]="promoCode"
                  placeholder="Enter promo code"
                  class="promo-input"
                />
                <button
                  (click)="applyPromo()"
                  class="btn btn-secondary"
                  [disabled]="validatingPromo"
                >
                  @if (validatingPromo) {
                  <span class="spinner-sm"></span>
                  }
                  <span>{{ validatingPromo ? 'Checking...' : 'Apply' }}</span>
                </button>
              </div>
              @if (promoError) {
              <div class="alert alert-error">
                <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ promoError }}</span>
              </div>
              } @if (promoSuccess) {
              <div class="alert alert-success">
                <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Promo code applied! {{ discountPercentage }}% discount</span>
              </div>
              }
            </div>
            }
          </div>

          <div class="sidebar">
            <div class="summary-card">
              <h3>Booking Summary</h3>

              @if (selectedTickets.length > 0) {
              <div class="summary-items">
                @for (selected of selectedTickets; track selected.ticketType.id) {
                <div class="summary-item">
                  <div>
                    <p class="item-name">{{ getCategoryName(selected.ticketType.category) }}</p>
                    <p class="item-details">
                      {{ selected.quantity }} × RM {{ selected.ticketType.price }}
                    </p>
                  </div>
                  <p class="item-price">RM {{ selected.quantity * selected.ticketType.price }}</p>
                </div>
                }
              </div>

              <div class="summary-divider"></div>

              <div class="summary-totals">
                <div class="total-row">
                  <span>Subtotal</span>
                  <span>RM {{ getSubtotal() }}</span>
                </div>
                @if (discountAmount > 0) {
                <div class="total-row discount">
                  <span>Discount ({{ discountPercentage }}%)</span>
                  <span>-RM {{ discountAmount }}</span>
                </div>
                }
                <div class="total-row final">
                  <span>Total</span>
                  <span>RM {{ getTotal() }}</span>
                </div>
              </div>

              <button
                (click)="proceedToPayment()"
                class="btn btn-primary btn-block"
                [disabled]="!canProceed() || processing"
              >
                @if (processing) {
                <span class="spinner-sm"></span>
                }
                <span>{{ processing ? 'Processing...' : 'Proceed to Payment' }}</span>
              </button>

              @if (!allSeatsSelected()) {
              <div class="warning-message">
                <svg class="warning-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Please select seats for all tickets</span>
              </div>
              } } @else {
              <div class="empty-message">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                <p>No tickets selected</p>
              </div>
              }
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .booking-page {
        min-height: 100vh;
        background: var(--primary-100);
        padding: 2rem 1rem 4rem;
      }

      .booking-header {
        background: linear-gradient(135deg, var(--accent-700) 0%, var(--accent-900) 100%);
        color: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        margin-bottom: 2rem;
      }

      .header-content {
        max-width: 1200px;
        margin: 0 auto;
      }

      .breadcrumb {
        margin-bottom: 1rem;
      }

      .breadcrumb a {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent-300);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color var(--transition-fast);
      }

      .breadcrumb a:hover {
        color: var(--neutral-white);
      }

      .breadcrumb-icon {
        width: 1.125rem;
        height: 1.125rem;
      }

      .page-title {
        font-size: 2rem;
        margin-bottom: 1rem;
      }

      .event-info h2 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .event-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent-300);
        font-size: 0.9375rem;
      }

      .meta-icon {
        width: 1.25rem;
        height: 1.25rem;
      }

      .booking-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        margin-bottom: 1.5rem;
      }

      .card-header {
        padding: 1.75rem 1.75rem 1rem;
        border-bottom: 1px solid var(--primary-200);
      }

      .card-header h3 {
        font-size: 1.25rem;
        color: var(--primary-900);
        margin-bottom: 0.25rem;
      }

      .card-header p {
        color: var(--primary-600);
        font-size: 0.875rem;
        margin: 0;
      }

      .ticket-list {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .ticket-selector {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem;
        border: 2px solid var(--primary-200);
        border-radius: var(--radius-lg);
        transition: all var(--transition-fast);
      }

      .ticket-selector:hover {
        border-color: var(--accent-300);
        background: var(--primary-100);
      }

      .ticket-info h4 {
        font-size: 1.125rem;
        color: var(--primary-900);
        margin: 0 0 0.5rem 0;
      }

      .section-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        background: var(--accent-300);
        color: var(--accent-900);
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
      }

      .badge-icon {
        width: 0.875rem;
        height: 0.875rem;
      }

      .price-info {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--accent-600);
      }

      .availability {
        font-size: 0.875rem;
        color: var(--primary-600);
      }

      .quantity-selector {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .qty-btn {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--accent-600);
        background: var(--neutral-white);
        color: var(--accent-600);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .qty-btn:hover:not(:disabled) {
        background: var(--accent-600);
        color: var(--neutral-white);
      }

      .qty-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .qty-btn svg {
        width: 1.25rem;
        height: 1.25rem;
      }

      .qty-input {
        width: 60px;
        text-align: center;
        padding: 0.625rem;
        border: 1px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary-900);
      }

      .seat-selection {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .seat-group-title {
        font-size: 1rem;
        color: var(--primary-900);
        margin: 0 0 1rem 0;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--primary-200);
      }

      .seats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 0.75rem;
      }

      .seat-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.375rem;
        padding: 0.875rem;
        border: 2px solid var(--primary-300);
        background: var(--neutral-white);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--primary-700);
      }

      .seat-btn:hover {
        border-color: var(--accent-500);
        background: var(--accent-300);
        color: var(--accent-900);
      }

      .seat-btn.selected {
        background: var(--accent-600);
        border-color: var(--accent-600);
        color: var(--neutral-white);
      }

      .seat-icon {
        width: 1.5rem;
        height: 1.5rem;
      }

      .promo-section {
        padding: 1.5rem;
        display: flex;
        gap: 0.75rem;
      }

      .promo-input {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 0.9375rem;
      }

      .summary-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--primary-200);
        padding: 1.75rem;
        position: sticky;
        top: 2rem;
      }

      .summary-card h3 {
        font-size: 1.25rem;
        color: var(--primary-900);
        margin: 0 0 1.5rem 0;
      }

      .summary-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }

      .item-name {
        font-weight: 600;
        color: var(--primary-900);
        margin: 0 0 0.25rem 0;
        font-size: 0.9375rem;
      }

      .item-details {
        color: var(--primary-600);
        font-size: 0.8125rem;
        margin: 0;
      }

      .item-price {
        font-weight: 700;
        color: var(--primary-900);
        margin: 0;
        white-space: nowrap;
      }

      .summary-divider {
        height: 1px;
        background: var(--primary-200);
        margin: 1.5rem 0;
      }

      .summary-totals {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        color: var(--primary-700);
        font-size: 0.9375rem;
      }

      .total-row.discount {
        color: var(--success-600);
        font-weight: 600;
      }

      .total-row.final {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-900);
        padding-top: 1rem;
        border-top: 2px solid var(--primary-300);
      }

      .btn-block {
        width: 100%;
        justify-content: center;
      }

      .warning-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem;
        background: var(--warning-100);
        border: 1px solid var(--warning-600);
        border-radius: var(--radius-md);
        color: var(--warning-700);
        font-size: 0.8125rem;
        margin-top: 1rem;
      }

      .warning-icon {
        width: 1.125rem;
        height: 1.125rem;
        flex-shrink: 0;
      }

      .empty-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        text-align: center;
      }

      .empty-icon {
        width: 3rem;
        height: 3rem;
        color: var(--primary-400);
        margin-bottom: 1rem;
      }

      .empty-message p {
        color: var(--primary-600);
        margin: 0;
      }

      .spinner-sm {
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      .alert-icon {
        width: 1.125rem;
        height: 1.125rem;
        flex-shrink: 0;
      }

      @media (max-width: 968px) {
        .booking-grid {
          grid-template-columns: 1fr;
        }

        .summary-card {
          position: static;
        }

        .seats-grid {
          grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
        }
      }
    `,
  ],
})
export class BookingComponent implements OnInit {
  event: Event | undefined;
  tickets: TicketType[] = [];
  selectedTickets: SelectedTicket[] = [];
  promoCode = '';
  promoError = '';
  promoSuccess = false;
  discountPercentage = 0;
  discountAmount = 0;
  loading = true;
  validatingPromo = false;
  processing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private ticketService: TicketService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.loadEvent(eventId);
      this.loadTickets(eventId);
    }
  }

  loadEvent(id: string): void {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.loading = false;
      },
    });
  }

  loadTickets(eventId: string): void {
    this.ticketService.getTicketsByEvent(eventId).subscribe({
      next: (tickets) => {
        this.tickets = tickets.filter((t) => t.availableTickets > 0);
      },
    });
  }

  getSelectedQuantity(ticket: TicketType): number {
    const selected = this.selectedTickets.find((s) => s.ticketType.id === ticket.id);
    return selected ? selected.quantity : 0;
  }

  increaseQuantity(ticket: TicketType): void {
    const existing = this.selectedTickets.find((s) => s.ticketType.id === ticket.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.selectedTickets.push({
        ticketType: ticket,
        quantity: 1,
        seatNumbers: [],
      });
    }
    this.recalculateDiscount();
  }

  decreaseQuantity(ticket: TicketType): void {
    const index = this.selectedTickets.findIndex((s) => s.ticketType.id === ticket.id);
    if (index !== -1) {
      if (this.selectedTickets[index].quantity > 1) {
        this.selectedTickets[index].quantity--;
        // Remove extra seat selections
        const currentSeats = this.selectedTickets[index].seatNumbers.length;
        if (currentSeats > this.selectedTickets[index].quantity) {
          this.selectedTickets[index].seatNumbers.pop();
        }
      } else {
        this.selectedTickets.splice(index, 1);
      }
    }
    this.recalculateDiscount();
  }

  getTotalTickets(): number {
    return this.selectedTickets.reduce((sum, s) => sum + s.quantity, 0);
  }

  generateSeats(section: SeatingSection, count: number): string[] {
    const prefix =
      section === SeatingSection.BALCONY ? 'B' : section === SeatingSection.MEZZANINE ? 'M' : 'S';
    return Array.from({ length: 20 }, (_, i) => `${prefix}${i + 1}`);
  }

  isSeatSelected(ticketTypeId: string, seat: string): boolean {
    const selected = this.selectedTickets.find((s) => s.ticketType.id === ticketTypeId);
    return selected ? selected.seatNumbers.includes(seat) : false;
  }

  toggleSeat(ticketTypeId: string, seat: string): void {
    const selected = this.selectedTickets.find((s) => s.ticketType.id === ticketTypeId);
    if (selected) {
      const index = selected.seatNumbers.indexOf(seat);
      if (index !== -1) {
        selected.seatNumbers.splice(index, 1);
      } else if (selected.seatNumbers.length < selected.quantity) {
        selected.seatNumbers.push(seat);
      }
    }
  }

  allSeatsSelected(): boolean {
    return this.selectedTickets.every((s) => s.seatNumbers.length === s.quantity);
  }

  applyPromo(): void {
    if (!this.promoCode || !this.event) return;

    this.validatingPromo = true;
    this.promoError = '';
    this.promoSuccess = false;

    this.ticketService.validatePromoCode(this.promoCode, this.event.id).subscribe({
      next: (promo) => {
        if (promo) {
          this.discountPercentage = promo.discountPercentage;
          this.promoSuccess = true;
          this.recalculateDiscount();
        } else {
          this.promoError = 'Invalid or expired promo code';
          this.discountPercentage = 0;
          this.discountAmount = 0;
        }
        this.validatingPromo = false;
      },
    });
  }

  recalculateDiscount(): void {
    if (this.discountPercentage > 0) {
      this.discountAmount = Math.round(this.getSubtotal() * (this.discountPercentage / 100));
    }
  }

  getSubtotal(): number {
    return this.selectedTickets.reduce((sum, s) => sum + s.ticketType.price * s.quantity, 0);
  }

  getTotal(): number {
    return this.getSubtotal() - this.discountAmount;
  }

  getCategoryName(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  canProceed(): boolean {
    return this.selectedTickets.length > 0 && this.allSeatsSelected();
  }

  proceedToPayment(): void {
    if (!this.canProceed() || !this.event) return;

    this.processing = true;

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.bookingService
      .createBooking(
        {
          eventId: this.event.id,
          tickets: this.selectedTickets.map((s) => ({
            ticketTypeId: s.ticketType.id,
            quantity: s.quantity,
            seatNumbers: s.seatNumbers,
            category: s.ticketType.category,
            section: s.ticketType.section,
            price: s.ticketType.price,
          })),
          promoCode: this.promoSuccess ? this.promoCode : undefined,
        },
        user.id,
        user.fullName,
        user.email,
        this.event.name,
        this.getSubtotal(),
        this.discountAmount,
        this.getTotal()
      )
      .subscribe({
        next: (booking) => {
          localStorage.setItem('current_booking', JSON.stringify(booking));
          this.router.navigate(['/payment', booking.id]);
        },
        error: () => {
          this.processing = false;
        },
      });
  }
}
