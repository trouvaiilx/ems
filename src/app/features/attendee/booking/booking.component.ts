// src/app/features/attendee/booking/booking.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking-page">
      <div class="container">
        @if (loading) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading booking details...</p>
        </div>
        } @else if (event) {
        <div class="booking-header">
          <h1>Book Tickets</h1>
          <div class="event-info">
            <h2>{{ event.name }}</h2>
            <p>{{ event.date | date : 'fullDate' }} • {{ event.time }}</p>
          </div>
        </div>

        <div class="booking-grid">
          <div class="main-content">
            <div class="card">
              <h3>Select Tickets</h3>
              @for (ticket of tickets; track ticket.id) {
              <div class="ticket-selector">
                <div class="ticket-info">
                  <h4>{{ getCategoryName(ticket.category) }}</h4>
                  <p class="section-badge">{{ ticket.section }}</p>
                  <p class="price">RM {{ ticket.price }}</p>
                  <p class="availability">{{ ticket.availableTickets }} available</p>
                </div>
                <div class="quantity-selector">
                  <button
                    (click)="decreaseQuantity(ticket)"
                    [disabled]="getSelectedQuantity(ticket) === 0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    [value]="getSelectedQuantity(ticket)"
                    [max]="ticket.availableTickets"
                    min="0"
                    readonly
                  />
                  <button
                    (click)="increaseQuantity(ticket)"
                    [disabled]="
                      getSelectedQuantity(ticket) >= ticket.availableTickets ||
                      getSelectedQuantity(ticket) >= 10
                    "
                  >
                    +
                  </button>
                </div>
              </div>
              }
            </div>

            @if (getTotalTickets() > 0) {
            <div class="card">
              <h3>Select Seats</h3>
              <div class="seat-selection">
                @for (selected of selectedTickets; track selected.ticketType.id) {
                <div class="seat-group">
                  <h4>
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
                      {{ seat }}
                    </button>
                    }
                  </div>
                </div>
                }
              </div>
            </div>

            <div class="card">
              <h3>Promotional Code</h3>
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
                  {{ validatingPromo ? 'Checking...' : 'Apply' }}
                </button>
              </div>
              @if (promoError) {
              <p class="error-message">{{ promoError }}</p>
              } @if (promoSuccess) {
              <p class="success-message">
                ✓ Promo code applied! {{ discountPercentage }}% discount
              </p>
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
                      {{ selected.quantity }} x RM {{ selected.ticketType.price }}
                    </p>
                  </div>
                  <p class="item-price">RM {{ selected.quantity * selected.ticketType.price }}</p>
                </div>
                }
              </div>

              <div class="divider"></div>

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
                {{ processing ? 'Processing...' : 'Proceed to Payment' }}
              </button>

              @if (!allSeatsSelected()) {
              <p class="warning-message">Please select seats for all tickets</p>
              } } @else {
              <p class="empty-message">No tickets selected</p>
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
        background: #f9fafb;
        padding: 2rem;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .booking-header {
        margin-bottom: 2rem;
      }

      .booking-header h1 {
        font-size: 2.5rem;
        margin: 0 0 1rem 0;
        color: #333;
      }

      .event-info h2 {
        font-size: 1.5rem;
        margin: 0 0 0.5rem 0;
        color: #6366f1;
      }

      .event-info p {
        color: #666;
        margin: 0;
      }

      .booking-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
      }

      @media (max-width: 968px) {
        .booking-grid {
          grid-template-columns: 1fr;
        }
      }

      .card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .card h3 {
        margin: 0 0 1.5rem 0;
        color: #333;
        font-size: 1.25rem;
      }

      .ticket-selector {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
      }

      .ticket-info h4 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .section-badge {
        display: inline-block;
        background: #dbeafe;
        color: #1e40af;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
      }

      .price {
        font-size: 1.25rem;
        font-weight: 700;
        color: #6366f1;
        margin: 0 0 0.25rem 0;
      }

      .availability {
        font-size: 0.875rem;
        color: #666;
        margin: 0;
      }

      .quantity-selector {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .quantity-selector button {
        width: 40px;
        height: 40px;
        border: 2px solid #6366f1;
        background: white;
        color: #6366f1;
        border-radius: 0.5rem;
        font-size: 1.25rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
      }

      .quantity-selector button:hover:not(:disabled) {
        background: #6366f1;
        color: white;
      }

      .quantity-selector button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .quantity-selector input {
        width: 60px;
        height: 40px;
        text-align: center;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 1.125rem;
        font-weight: 600;
      }

      .seat-selection {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .seat-group h4 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .seats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 0.5rem;
      }

      .seat-btn {
        padding: 0.75rem;
        border: 2px solid #e5e7eb;
        background: white;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 600;
      }

      .seat-btn:hover {
        border-color: #6366f1;
        background: #f0f1ff;
      }

      .seat-btn.selected {
        background: #6366f1;
        color: white;
        border-color: #6366f1;
      }

      .promo-section {
        display: flex;
        gap: 1rem;
      }

      .promo-input {
        flex: 1;
        padding: 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: 1rem;
      }

      .promo-input:focus {
        outline: none;
        border-color: #6366f1;
      }

      .error-message {
        color: #dc2626;
        margin: 0.5rem 0 0 0;
        font-size: 0.875rem;
      }

      .success-message {
        color: #059669;
        margin: 0.5rem 0 0 0;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .warning-message {
        color: #f59e0b;
        margin: 1rem 0 0 0;
        font-size: 0.875rem;
        text-align: center;
      }

      .summary-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 2rem;
      }

      .summary-card h3 {
        margin: 0 0 1.5rem 0;
        color: #333;
      }

      .summary-items {
        margin-bottom: 1rem;
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e7eb;
      }

      .item-name {
        font-weight: 600;
        color: #333;
        margin: 0 0 0.25rem 0;
      }

      .item-details {
        font-size: 0.875rem;
        color: #666;
        margin: 0;
      }

      .item-price {
        font-weight: 700;
        color: #333;
        margin: 0;
      }

      .divider {
        height: 1px;
        background: #e5e7eb;
        margin: 1rem 0;
      }

      .summary-totals {
        margin-bottom: 1.5rem;
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        color: #666;
      }

      .total-row.discount {
        color: #059669;
        font-weight: 600;
      }

      .total-row.final {
        font-size: 1.25rem;
        font-weight: 700;
        color: #333;
        padding-top: 0.75rem;
        border-top: 2px solid #e5e7eb;
      }

      .btn {
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
      }

      .btn-block {
        width: 100%;
      }

      .btn-primary {
        background: #6366f1;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: #4f46e5;
        transform: translateY(-2px);
      }

      .btn-secondary {
        background: #e5e7eb;
        color: #333;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #d1d5db;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .empty-message {
        text-align: center;
        color: #666;
        padding: 2rem;
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
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
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

    // Store ticket info temporarily for booking creation
    (window as any).tempTicketCategory = this.selectedTickets[0]?.ticketType.category;
    (window as any).tempTicketSection = this.selectedTickets[0]?.ticketType.section;
    (window as any).tempTicketPrice = this.selectedTickets[0]?.ticketType.price;

    this.bookingService
      .createBooking(
        {
          eventId: this.event.id,
          tickets: this.selectedTickets.map((s) => ({
            ticketTypeId: s.ticketType.id,
            quantity: s.quantity,
            seatNumbers: s.seatNumbers,
          })),
          promoCode: this.promoSuccess ? this.promoCode : undefined,
        },
        user.id,
        user.fullName,
        user.email,
        this.event.name, // Pass event name
        this.getSubtotal(), // Pass total amount
        this.discountAmount, // Pass discount
        this.getTotal() // Pass final amount
      )
      .subscribe({
        next: (booking) => {
          // Store booking ID in localStorage for payment page
          localStorage.setItem('current_booking', JSON.stringify(booking));
          this.router.navigate(['/payment', booking.id]);
        },
        error: () => {
          this.processing = false;
        },
      });
  }
}
