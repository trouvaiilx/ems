// src/app/features/attendee/event-detail/event-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Event } from '../../../core/models/event.model';
import { TicketType } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="event-detail-page">
      @if (loading) {
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading event details...</p>
      </div>
      } @else if (event) {
      <div class="event-header">
        <div class="container">
          <div class="header-content">
            @if (event.posterUrl) {
            <img [src]="event.posterUrl" [alt]="event.name" class="event-poster" />
            } @else {
            <div class="event-poster placeholder">🎭</div>
            }
            <div class="header-info">
              <h1>{{ event.name }}</h1>
              <div class="event-meta">
                <div class="meta-item">
                  <span class="icon">📅</span>
                  <span>{{ event.date | date : 'fullDate' }}</span>
                </div>
                <div class="meta-item">
                  <span class="icon">🕐</span>
                  <span>{{ event.time }}</span>
                </div>
                <div class="meta-item">
                  <span class="icon">👤</span>
                  <span>{{ event.organizerName }}</span>
                </div>
              </div>
              <p class="event-description">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="content-grid">
          <div class="main-content">
            <section class="section">
              <h2>About This Event</h2>
              <p>{{ event.description }}</p>
              <div class="event-highlights">
                <div class="highlight-item">
                  <span class="highlight-icon">🎭</span>
                  <div>
                    <h4>Venue</h4>
                    <p>HELP Events Auditorium</p>
                  </div>
                </div>
                <div class="highlight-item">
                  <span class="highlight-icon">🎫</span>
                  <div>
                    <h4>Ticket Types</h4>
                    <p>Multiple categories available</p>
                  </div>
                </div>
                <div class="highlight-item">
                  <span class="highlight-icon">💺</span>
                  <div>
                    <h4>Seating</h4>
                    <p>Balcony, Mezzanine & Stall</p>
                  </div>
                </div>
              </div>
            </section>

            <section class="section">
              <h2>Seating Layout</h2>
              <div class="seating-diagram">
                <div class="stage">STAGE</div>
                <div class="seating-sections">
                  <div class="section-item stall">
                    <h4>Stall</h4>
                    <p>Ground level seating</p>
                  </div>
                  <div class="section-item mezzanine">
                    <h4>Mezzanine</h4>
                    <p>Mid-level seating</p>
                  </div>
                  <div class="section-item balcony">
                    <h4>Balcony</h4>
                    <p>Premium upper level seating</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div class="sidebar">
            <div class="ticket-card">
              <h3>Available Tickets</h3>
              @if (loadingTickets) {
              <p class="loading-text">Loading tickets...</p>
              } @else if (tickets.length > 0) {
              <div class="ticket-list">
                @for (ticket of tickets; track ticket.id) {
                <div class="ticket-item">
                  <div class="ticket-info">
                    <h4>{{ getCategoryName(ticket.category) }}</h4>
                    <p class="ticket-section">{{ ticket.section }}</p>
                    <p class="ticket-availability">
                      @if (ticket.availableTickets > 0) {
                      <span class="available">{{ ticket.availableTickets }} available</span>
                      } @else {
                      <span class="sold-out">Sold Out</span>
                      }
                    </p>
                  </div>
                  <div class="ticket-price">
                    <span class="currency">RM</span>
                    <span class="amount">{{ ticket.price }}</span>
                  </div>
                </div>
                }
              </div>

              @if (isLoggedIn) {
              <button
                (click)="bookTickets()"
                class="btn btn-primary btn-block"
                [disabled]="!hasAvailableTickets()"
              >
                {{ hasAvailableTickets() ? 'Book Tickets' : 'Sold Out' }}
              </button>
              } @else {
              <a routerLink="/login" class="btn btn-primary btn-block"> Login to Book </a>
              } @if (!hasAvailableTickets() && isLoggedIn) {
              <button (click)="joinWaitlist()" class="btn btn-secondary btn-block">
                Join Waitlist
              </button>
              } } @else {
              <p class="no-tickets">Tickets not available yet</p>
              }
            </div>

            <div class="info-card">
              <h4>Important Information</h4>
              <ul>
                <li>Tickets are non-refundable within 7 days of event</li>
                <li>QR code will be sent to your email</li>
                <li>Entry is subject to QR code verification</li>
                <li>Promotional codes accepted at checkout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      } @else {
      <div class="error-container">
        <h2>Event Not Found</h2>
        <p>The event you're looking for doesn't exist.</p>
        <a routerLink="/events" class="btn btn-primary">Browse Events</a>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .event-detail-page {
        min-height: 100vh;
        background: #f9fafb;
      }

      .event-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 3rem 2rem;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .header-content {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 3rem;
        align-items: start;
      }

      @media (max-width: 768px) {
        .header-content {
          grid-template-columns: 1fr;
        }
      }

      .event-poster {
        width: 100%;
        height: 400px;
        object-fit: cover;
        border-radius: 1rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .event-poster.placeholder {
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 6rem;
      }

      .header-info h1 {
        font-size: 3rem;
        margin: 0 0 1.5rem 0;
      }

      .event-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        margin-bottom: 1.5rem;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
      }

      .icon {
        font-size: 1.5rem;
      }

      .event-description {
        font-size: 1.1rem;
        line-height: 1.6;
        opacity: 0.95;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        padding: 3rem 2rem;
      }

      @media (max-width: 968px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }

      .section {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .section h2 {
        margin: 0 0 1.5rem 0;
        color: #333;
      }

      .event-highlights {
        display: grid;
        gap: 1.5rem;
        margin-top: 2rem;
      }

      .highlight-item {
        display: flex;
        gap: 1rem;
        align-items: start;
      }

      .highlight-icon {
        font-size: 2.5rem;
      }

      .highlight-item h4 {
        margin: 0 0 0.25rem 0;
        color: #333;
      }

      .highlight-item p {
        margin: 0;
        color: #666;
      }

      .seating-diagram {
        background: #f9fafb;
        padding: 2rem;
        border-radius: 0.5rem;
        border: 2px dashed #e5e7eb;
      }

      .stage {
        background: #333;
        color: white;
        text-align: center;
        padding: 1rem;
        border-radius: 0.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
      }

      .seating-sections {
        display: grid;
        gap: 1rem;
      }

      .section-item {
        padding: 1rem;
        border-radius: 0.5rem;
        border: 2px solid #e5e7eb;
      }

      .section-item h4 {
        margin: 0 0 0.25rem 0;
        color: #333;
      }

      .section-item p {
        margin: 0;
        color: #666;
        font-size: 0.875rem;
      }

      .section-item.stall {
        background: #d1fae5;
        border-color: #10b981;
      }

      .section-item.mezzanine {
        background: #dbeafe;
        border-color: #3b82f6;
      }

      .section-item.balcony {
        background: #fef3c7;
        border-color: #fbbf24;
      }

      .ticket-card,
      .info-card {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;
      }

      .ticket-card h3,
      .info-card h4 {
        margin: 0 0 1.5rem 0;
        color: #333;
      }

      .ticket-list {
        margin-bottom: 1.5rem;
      }

      .ticket-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        transition: border-color 0.3s;
      }

      .ticket-item:hover {
        border-color: #6366f1;
      }

      .ticket-info h4 {
        margin: 0 0 0.25rem 0;
        color: #333;
        font-size: 1.1rem;
      }

      .ticket-section {
        color: #6366f1;
        font-size: 0.875rem;
        margin: 0 0 0.5rem 0;
        font-weight: 600;
      }

      .ticket-availability {
        margin: 0;
        font-size: 0.875rem;
      }

      .available {
        color: #10b981;
        font-weight: 600;
      }

      .sold-out {
        color: #ef4444;
        font-weight: 600;
      }

      .ticket-price {
        text-align: right;
      }

      .currency {
        font-size: 0.875rem;
        color: #666;
      }

      .amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
        margin-left: 0.25rem;
      }

      .btn {
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        text-align: center;
        transition: all 0.3s;
      }

      .btn-block {
        width: 100%;
        margin-bottom: 0.5rem;
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

      .btn-secondary:hover {
        background: #d1d5db;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .info-card ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .info-card li {
        padding: 0.75rem 0;
        border-bottom: 1px solid #e5e7eb;
        color: #666;
      }

      .info-card li:last-child {
        border-bottom: none;
      }

      .info-card li:before {
        content: '✓';
        color: #10b981;
        font-weight: 700;
        margin-right: 0.5rem;
      }

      .loading-container,
      .error-container {
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

      .loading-text,
      .no-tickets {
        text-align: center;
        color: #666;
        padding: 1rem;
      }
    `,
  ],
})
export class EventDetailComponent implements OnInit {
  event: Event | undefined;
  tickets: TicketType[] = [];
  loading = true;
  loadingTickets = true;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const eventId = this.route.snapshot.paramMap.get('id');
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
      error: () => {
        this.loading = false;
      },
    });
  }

  loadTickets(eventId: string): void {
    this.ticketService.getTicketsByEvent(eventId).subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.loadingTickets = false;
      },
      error: () => {
        this.loadingTickets = false;
      },
    });
  }

  getCategoryName(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  hasAvailableTickets(): boolean {
    return this.tickets.some((t) => t.availableTickets > 0);
  }

  bookTickets(): void {
    if (this.event) {
      this.router.navigate(['/booking', this.event.id]);
    }
  }

  joinWaitlist(): void {
    if (this.event) {
      this.router.navigate(['/events', this.event.id], {
        queryParams: { action: 'waitlist' },
      });
    }
  }
}
