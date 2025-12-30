// src/app/features/attendee/booking/booking.component.ts

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
        <div class="loading-container">
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading booking details...</p>
          </div>
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
                <p>Choose your preferred seats from the venue map</p>
              </div>
              <div class="seat-selection-entry">
                <button (click)="openOverlay()" class="btn btn-primary btn-lg">
                  <svg class="icon-map" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Open Seat Map
                </button>
                @if (getAllSelectedSeatsCount() > 0) {
                <p class="selection-hint">{{ getAllSelectedSeatsCount() }} seats selected</p>
                }
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div class="header-with-icon">
                  <svg class="header-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3>Promotional Code</h3>
                    <p>Have a promo code? Apply it here</p>
                  </div>
                </div>
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
              <div class="promo-alert alert-error">
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
              <div class="promo-alert alert-success">
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

      <!-- SEAT OVERLAY -->
      @if (showOverlay) {
      <div class="seat-overlay-backdrop">
        <div class="seat-overlay-container">
          <div class="overlay-header">
            <h2>Select Seats</h2>
            <div class="overlay-controls">
              <div class="zoom-controls">
                <button (click)="zoomOut()" class="btn-icon">-</button>
                <span>{{ Math.round(zoomLevel * 100) }}%</span>
                <button (click)="zoomIn()" class="btn-icon">+</button>
              </div>
              <button (click)="closeOverlay()" class="btn btn-primary">Done</button>
            </div>
          </div>

          <div
            class="viewport"
            #viewport
            (wheel)="onWheel($event)"
            (mousedown)="onMouseDown($event)"
            (mousemove)="onMouseMove($event)"
            (mouseup)="onMouseUp()"
            (mouseleave)="onMouseUp()"
            (touchstart)="onTouchStart($event)"
            (touchmove)="onTouchMove($event)"
            (touchend)="onTouchEnd()"
          >
            <div
              class="venue-map"
              [style.transform]="transformStyle"
              [style.transform-origin]="'center top'"
            >
              <!-- STAGE -->
              <div class="stage">STAGE</div>

              <!-- STALL (75 Seats) -->
              <div class="section-container stall">
                <h3>Stall (Ground Floor)</h3>
                <div class="seats-grid stall-grid">
                  @for (seat of stallSeats; track seat) {
                  <button
                    class="seat-btn"
                    [class.selected]="isSeatSelectedGlobal(seat)"
                    [class.booked]="isSeatBooked(seat)"
                    [class.disabled]="isSeatDisabled(seat)"
                    [disabled]="isSeatBooked(seat) || isSeatDisabled(seat)"
                    (click)="toggleSeatGlobal(seat)"
                    [title]="getSeatTooltip(seat)"
                  >
                    {{ seat }}
                  </button>
                  }
                </div>
              </div>

              <!-- MEZZANINE (50 Seats) -->
              <div class="section-container mezzanine">
                <h3>Mezzanine (1st Floor)</h3>
                <div class="seats-grid mezzanine-grid">
                  @for (seat of mezzanineSeats; track seat) {
                  <button
                    class="seat-btn"
                    [class.selected]="isSeatSelectedGlobal(seat)"
                    [class.booked]="isSeatBooked(seat)"
                    [class.disabled]="isSeatDisabled(seat)"
                    [disabled]="isSeatBooked(seat) || isSeatDisabled(seat)"
                    (click)="toggleSeatGlobal(seat)"
                    [title]="getSeatTooltip(seat)"
                  >
                    {{ seat }}
                  </button>
                  }
                </div>
              </div>

              <!-- BALCONY (25 Seats) -->
              <div class="section-container balcony">
                <h3>Balcony (2nd Floor)</h3>
                <div class="seats-grid balcony-grid">
                  @for (seat of balconySeats; track seat) {
                  <button
                    class="seat-btn"
                    [class.selected]="isSeatSelectedGlobal(seat)"
                    [class.booked]="isSeatBooked(seat)"
                    [class.disabled]="isSeatDisabled(seat)"
                    [disabled]="isSeatBooked(seat) || isSeatDisabled(seat)"
                    (click)="toggleSeatGlobal(seat)"
                    [title]="getSeatTooltip(seat)"
                  >
                    {{ seat }}
                  </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .booking-page {
        min-height: 100vh;
        background: var(--primary-100);
        padding: 2rem 1rem 4rem;
      }

      /* Centered Loading State */
      .loading-container {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-100);
        z-index: 100;
      }

      .loading-state {
        text-align: center;
        padding: 2rem;
      }

      .loading-state .spinner {
        width: 50px;
        height: 50px;
        border: 3px solid var(--primary-300);
        border-top-color: var(--accent-600);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 1.5rem;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .loading-state p {
        color: var(--primary-600);
        margin: 0;
        font-size: 0.9375rem;
        font-weight: 500;
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

      .header-with-icon {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      .header-icon {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--accent-600);
        flex-shrink: 0;
        margin-top: 0.125rem;
      }

      .header-with-icon > div {
        flex: 1;
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
        margin: 0 0 0.25rem 0;
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

      @media (max-width: 968px) {
        .booking-grid {
          grid-template-columns: 1fr;
        }

        .sidebar {
          order: 2; /* Ensure sidebar comes after main content if needed, though naturally it does */
        }

        /* Seat map mobile adjustments */
        .seat-overlay-container {
          width: 100%;
          height: 100%;
          border-radius: 0;
          display: flex;
          flex-direction: column;
        }

        .overlay-header {
          position: sticky;
          top: 0;
          z-index: 10;
          background: var(--neutral-white);
        }

        .viewport {
          flex: 1;
        }
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
        background: var(--accent-300);
        color: var(--accent-900);
      }

      .seat-btn:disabled,
      .seat-btn.booked {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--neutral-200);
        border-color: var(--neutral-300);
        color: var(--neutral-500);
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

      .promo-alert {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        margin: 1.5rem;
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .promo-alert .alert-icon {
        width: 1.25rem;
        height: 1.25rem;
        flex-shrink: 0;
      }

      .promo-alert.alert-error {
        background: var(--error-100);
        border: 1px solid var(--error-600);
        color: var(--error-700);
      }

      .promo-alert.alert-success {
        background: var(--success-100);
        border: 1px solid var(--success-600);
        color: var(--success-700);
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

      .btn-secondary {
        background: var(--primary-200);
        color: var(--primary-900);
      }

      .btn-secondary:hover:not(:disabled) {
        background: var(--primary-300);
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
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

      /* Overlay Styles */
      .seat-overlay-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .seat-overlay-container {
        width: 100%;
        max-width: 1000px;
        height: 90vh;
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .overlay-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--primary-200);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        z-index: 10;
      }

      .overlay-controls {
        display: flex;
        gap: 1.5rem;
        align-items: center;
      }

      .zoom-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--primary-100);
        padding: 0.25rem;
        border-radius: 0.5rem;
      }

      .viewport {
        flex: 1;
        overflow: hidden;
        padding: 4rem;
        background: #f3f4f6;
        display: flex;
        justify-content: center;
        cursor: grab;
      }

      .viewport:active {
        cursor: grabbing;
      }

      .venue-map {
        width: 800px; /* Fixed base width */
        display: flex;
        flex-direction: column;
        gap: 3rem;
        align-items: center;
        transition: transform 0.1s linear; /* Faster transition for drag */
      }

      .stage {
        width: 60%;
        height: 80px;
        background: var(--primary-900);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        letter-spacing: 2px;
        border-radius: 0 0 50px 50px;
        margin-bottom: 2rem;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }

      .section-container {
        width: 100%;
        background: white;
        padding: 2rem;
        border-radius: 2rem;
        border: 2px solid var(--primary-100);
        position: relative;
      }

      .section-container h3 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: var(--primary-500);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 0.9rem;
      }

      .stall {
        border-color: #3b82f6;
      }
      .mezzanine {
        border-color: #8b5cf6;
        width: 85%;
      }
      .balcony {
        border-color: #ec4899;
        width: 70%;
      }

      .stall h3 {
        color: #3b82f6;
      }
      .mezzanine h3 {
        color: #8b5cf6;
      }
      .balcony h3 {
        color: #ec4899;
      }

      .seats-grid {
        display: grid;
        gap: 0.5rem;
        justify-content: center;
        justify-items: center;
      }

      .stall-grid {
        grid-template-columns: repeat(15, 1fr);
      }
      .mezzanine-grid {
        grid-template-columns: repeat(10, 1fr);
      }
      .balcony-grid {
        grid-template-columns: repeat(5, 1fr);
      }

      .seat-btn {
        width: 32px;
        height: 32px;
        border-radius: 6px; /* Squircle */
        border: none;
        background: var(--primary-200);
        color: var(--primary-700);
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .seat-btn:hover:not(:disabled) {
        transform: scale(1.2);
        z-index: 2;
      }

      .seat-btn.selected {
        background: var(--accent-600);
        color: white;
        box-shadow: 0 0 10px var(--accent-300);
      }

      .seat-btn.disabled {
        opacity: 0.3;
        background: var(--neutral-300);
        cursor: not-allowed;
      }

      .seat-selection-entry {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
      }

      .btn-lg {
        padding: 1rem 2rem;
        font-size: 1.1rem;
      }

      .icon-map {
        width: 1.5rem;
        height: 1.5rem;
      }
    `,
  ],
})
export class BookingComponent implements OnInit {
  Math = Math;
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
  bookedSeats: string[] = [];

  // Overlay State
  showOverlay = false;
  zoomLevel = 1;
  panX = 0;
  panY = 0;
  isDragging = false;
  lastClientX = 0;
  lastClientY = 0;

  get transformStyle(): string {
    return `scale(${this.zoomLevel}) translate(${this.panX}px, ${this.panY}px)`;
  }

  // Global Venue Config
  stallSeats: string[] = [];
  mezzanineSeats: string[] = [];
  balconySeats: string[] = [];

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
      this.generateAllSeats();
    }
  }

  generateAllSeats(): void {
    // Stall: 75 seats (S1-S75)
    this.stallSeats = Array.from({ length: 75 }, (_, i) => `S${i + 1}`);

    // Mezzanine: 50 seats (M1-M50)
    this.mezzanineSeats = Array.from({ length: 50 }, (_, i) => `M${i + 1}`);

    // Balcony: 25 seats (B1-B25)
    this.balconySeats = Array.from({ length: 25 }, (_, i) => `B${i + 1}`);
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

  loadBookedSeats(eventId: string): void {
    this.bookingService.getBookedSeats(eventId).subscribe({
      next: (seats) => {
        this.bookedSeats = seats;
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

  isSeatBooked(seat: string): boolean {
    return this.bookedSeats.includes(seat);
  }

  openOverlay(): void {
    if (this.selectedTickets.length === 0) {
      alert('Please select at least one ticket first.');
      return;
    }
    this.showOverlay = true;
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
  }

  closeOverlay(): void {
    this.showOverlay = false;
  }

  zoomIn(): void {
    if (this.zoomLevel < 3) this.zoomLevel += 0.2;
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.6) this.zoomLevel -= 0.2;
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const zoomSensitivity = 0.001;
    const newZoom = this.zoomLevel - event.deltaY * zoomSensitivity;
    this.zoomLevel = Math.max(0.5, Math.min(newZoom, 3));
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.lastClientX = event.clientX;
    this.lastClientY = event.clientY;
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const deltaX = event.clientX - this.lastClientX;
    const deltaY = event.clientY - this.lastClientY;

    this.panX += deltaX / this.zoomLevel;
    this.panY += deltaY / this.zoomLevel;

    this.lastClientX = event.clientX;
    this.lastClientY = event.clientY;
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.lastClientX = event.touches[0].clientX;
      this.lastClientY = event.touches[0].clientY;
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || event.touches.length !== 1) return;
    event.preventDefault();
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.lastClientX;
    const deltaY = touch.clientY - this.lastClientY;

    this.panX += deltaX / this.zoomLevel;
    this.panY += deltaY / this.zoomLevel;

    this.lastClientX = touch.clientX;
    this.lastClientY = touch.clientY;
  }

  onTouchEnd(): void {
    this.isDragging = false;
  }

  isSeatDisabled(seat: string): boolean {
    // Find which ticket type corresponds to this seat's section
    // S -> Stall, M -> Mezzanine, B -> Balcony
    let requiredSection: SeatingSection;
    if (seat.startsWith('S')) requiredSection = SeatingSection.STALL;
    else if (seat.startsWith('M')) requiredSection = SeatingSection.MEZZANINE;
    else requiredSection = SeatingSection.BALCONY;

    // Check if user has selected a ticket for this section
    // If ANY of the selected ticket types matches this section, enable it?
    // OR, more strictly: user is clicking a seat, which bucket does it go to?
    // The previous logic was "bucket first". This is "seat first".
    // If I click S5, I need to have a selected ticket of type STALL that needs seats.
    // AND that ticket type must have remaining quantity to select.

    // Get all selected ticket types that match this section
    const matchingTypes = this.selectedTickets.filter(
      (s) => s.ticketType.section === requiredSection
    );

    if (matchingTypes.length === 0) return true; // Grey out if no ticket for this section

    return false;
  }

  getSeatTooltip(seat: string): string {
    if (this.isSeatBooked(seat)) return 'Booked';
    if (this.isSeatDisabled(seat)) return 'Ticket not selected for this section';
    return seat;
  }

  toggleSeatGlobal(seat: string): void {
    if (this.isSeatBooked(seat)) return;

    // Determine section
    let requiredSection: SeatingSection;
    if (seat.startsWith('S')) requiredSection = SeatingSection.STALL;
    else if (seat.startsWith('M')) requiredSection = SeatingSection.MEZZANINE;
    else requiredSection = SeatingSection.BALCONY;

    // Check if already selected by any ticket
    let owningTicket = this.selectedTickets.find((s) => s.seatNumbers.includes(seat));

    if (owningTicket) {
      // DESELECT
      const idx = owningTicket.seatNumbers.indexOf(seat);
      owningTicket.seatNumbers.splice(idx, 1);
    } else {
      // SELECT
      // Find a ticket of this section that has room
      const eligibleTicket = this.selectedTickets.find(
        (s) => s.ticketType.section === requiredSection && s.seatNumbers.length < s.quantity
      );

      if (eligibleTicket) {
        eligibleTicket.seatNumbers.push(seat);
      } else {
        // Find a ticket of this section that is full?
        // Maybe warn or auto-select not possible if fully allocated.
        // If all matching tickets are full, maybe check if we can add quantity?
        // For now, simpler: if no room, ignore click or show msg?
        const hasTicket = this.selectedTickets.some(
          (s) => s.ticketType.section === requiredSection
        );
        if (hasTicket) {
          alert(
            'You have already selected all seats for this ticket type. Increase quantity to select more.'
          );
        } else {
          alert('You have not selected a ticket for this section.');
        }
      }
    }
  }

  isSeatSelectedGlobal(seat: string): boolean {
    return this.selectedTickets.some((s) => s.seatNumbers.includes(seat));
  }

  getAllSelectedSeatsCount(): number {
    return this.selectedTickets.reduce((sum, s) => sum + s.seatNumbers.length, 0);
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
        this.event.date,
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
