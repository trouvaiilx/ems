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
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading event details...</p>
      </div>
      } @else if (event) {
      <div class="event-hero">
        <div class="hero-overlay"></div>
        <div
          class="hero-background"
          [style.background-image]="event.posterUrl ? 'url(' + event.posterUrl + ')' : 'none'"
        ></div>
        <div class="container hero-content">
          <div class="breadcrumb">
            <a routerLink="/events">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              Back to Events
            </a>
          </div>
          <h1 class="event-title">{{ event.name }}</h1>
          <div class="event-meta">
            <div class="meta-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ event.date | date : 'fullDate' }}</span>
            </div>
            <div class="meta-item">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ event.time }}</span>
            </div>
            <div class="meta-item">
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
      </div>

      <div class="container">
        <div class="content-grid">
          <div class="main-content">
            <div class="card">
              <div class="card-header">
                <h2>About This Event</h2>
              </div>
              <div class="card-content">
                <p class="event-description">{{ event.description }}</p>
                <div class="highlights">
                  <div class="highlight-item">
                    <div class="highlight-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>Venue</h4>
                      <p>HELP Events Auditorium</p>
                    </div>
                  </div>
                  <div class="highlight-item">
                    <div class="highlight-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>Ticket Types</h4>
                      <p>Multiple categories available</p>
                    </div>
                  </div>
                  <div class="highlight-item">
                    <div class="highlight-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>Seating</h4>
                      <p>Balcony, Mezzanine & Stall</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h2>Seating Layout</h2>
              </div>
              <div class="card-content">
                <div class="seating-diagram">
                  <div class="stage">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                    <span>STAGE</span>
                  </div>
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
              </div>
            </div>
          </div>

          <div class="sidebar">
            <div class="ticket-card">
              <div class="card-header">
                <h3>Available Tickets</h3>
              </div>
              <div class="card-content">
                @if (loadingTickets) {
                <p class="loading-text">Loading tickets...</p>
                } @else if (tickets.length > 0) {
                <div class="ticket-list">
                  @for (ticket of tickets; track ticket.id) {
                  <div class="ticket-item">
                    <div class="ticket-info">
                      <h4>{{ getCategoryName(ticket.category) }}</h4>
                      <span class="ticket-section">{{ ticket.section }}</span>
                      <p class="ticket-availability">
                        @if (ticket.availableTickets > 0) {
                        <span class="badge badge-success"
                          >{{ ticket.availableTickets }} available</span
                        >
                        } @else {
                        <span class="badge badge-error">Sold Out</span>
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
                <a routerLink="/login" class="btn btn-primary btn-block">Sign In to Book</a>
                } @if (!hasAvailableTickets() && isLoggedIn) {
                <button (click)="joinWaitlist()" class="btn btn-secondary btn-block">
                  Join Waitlist
                </button>
                } } @else {
                <p class="empty-text">Tickets not available yet</p>
                }
              </div>
            </div>

            <div class="info-card">
              <div class="card-header">
                <h4>Important Information</h4>
              </div>
              <div class="card-content">
                <ul class="info-list">
                  <li>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Non-refundable within 7 days of event</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>QR code sent via email</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>QR code verification required</span>
                  </li>
                  <li>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Promotional codes accepted</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      } @else {
      <div class="error-container">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
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
        background: var(--primary-100);
      }

      .event-hero {
        position: relative;
        background: linear-gradient(135deg, var(--accent-700) 0%, var(--accent-900) 100%);
        color: var(--neutral-white);
        padding: 4rem 2rem;
        min-height: 400px;
        display: flex;
        align-items: flex-end;
      }

      .hero-background {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        opacity: 0.2;
      }

      .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.95) 100%);
      }

      .hero-content {
        position: relative;
        z-index: 1;
      }

      .breadcrumb {
        margin-bottom: 2rem;
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

      .breadcrumb svg {
        width: 1.125rem;
        height: 1.125rem;
      }

      .event-title {
        font-size: 3rem;
        margin-bottom: 1.5rem;
        line-height: 1.1;
      }

      .event-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        font-size: 1rem;
      }

      .meta-item svg {
        width: 1.25rem;
        height: 1.25rem;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        padding: 2rem 0 4rem;
      }

      .card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        margin-bottom: 1.5rem;
      }

      .card-header {
        padding: 1.75rem;
        border-bottom: 1px solid var(--primary-200);
      }

      .card-header h2,
      .card-header h3,
      .card-header h4 {
        font-size: 1.25rem;
        color: var(--primary-900);
        margin: 0;
      }

      .card-content {
        padding: 1.75rem;
      }

      .event-description {
        color: var(--primary-700);
        line-height: 1.7;
        margin-bottom: 2rem;
      }

      .highlights {
        display: grid;
        gap: 1.25rem;
      }

      .highlight-item {
        display: flex;
        gap: 1.25rem;
        align-items: start;
        padding: 1.25rem;
        background: var(--primary-100);
        border-radius: var(--radius-lg);
      }

      .highlight-icon {
        width: 3rem;
        height: 3rem;
        background: var(--accent-300);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .highlight-icon svg {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--accent-800);
        stroke-width: 2;
      }

      .highlight-item h4 {
        font-size: 1rem;
        color: var(--primary-900);
        margin: 0 0 0.25rem 0;
      }

      .highlight-item p {
        color: var(--primary-600);
        font-size: 0.875rem;
        margin: 0;
      }

      .seating-diagram {
        background: var(--primary-100);
        padding: 2rem;
        border-radius: var(--radius-lg);
        border: 2px dashed var(--primary-300);
      }

      .stage {
        background: var(--primary-800);
        color: var(--neutral-white);
        text-align: center;
        padding: 1.5rem;
        border-radius: var(--radius-md);
        font-weight: 600;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
      }

      .stage svg {
        width: 1.5rem;
        height: 1.5rem;
      }

      .seating-sections {
        display: grid;
        gap: 1rem;
      }

      .section-item {
        padding: 1.25rem;
        border-radius: var(--radius-md);
        border: 2px solid;
      }

      .section-item h4 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
      }

      .section-item p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.9;
      }

      .section-item.stall {
        background: var(--success-100);
        border-color: var(--success-600);
        color: var(--success-900);
      }

      .section-item.mezzanine {
        background: var(--accent-300);
        border-color: var(--accent-600);
        color: var(--accent-900);
      }

      .section-item.balcony {
        background: var(--warning-100);
        border-color: var(--warning-600);
        color: var(--warning-900);
      }

      .ticket-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--primary-200);
        position: sticky;
        top: 2rem;
        align-self: flex-start;
        margin-bottom: 1.5rem;
      }

      .info-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--primary-200);
        margin-bottom: 1.5rem;
      }

      .ticket-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .ticket-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem;
        border: 2px solid var(--primary-200);
        border-radius: var(--radius-lg);
        transition: all var(--transition-fast);
      }

      .ticket-item:hover {
        border-color: var(--accent-500);
        background: var(--primary-100);
      }

      .ticket-info h4 {
        font-size: 1rem;
        color: var(--primary-900);
        margin: 0 0 0.375rem 0;
      }

      .ticket-section {
        display: inline-block;
        color: var(--accent-600);
        font-size: 0.8125rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .ticket-availability {
        margin: 0;
      }

      .ticket-price {
        text-align: right;
      }

      .currency {
        font-size: 0.875rem;
        color: var(--primary-600);
      }

      .amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-900);
        margin-left: 0.25rem;
      }

      .btn-block {
        width: 100%;
        justify-content: center;
        margin-bottom: 0.75rem;
      }

      .info-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
      }

      .info-list li {
        display: flex;
        align-items: start;
        gap: 0.75rem;
        color: var(--primary-700);
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .info-list svg {
        width: 1.125rem;
        height: 1.125rem;
        color: var(--success-600);
        flex-shrink: 0;
        margin-top: 0.125rem;
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

      .loading-text,
      .empty-text {
        text-align: center;
        color: var(--primary-600);
        padding: 2rem;
        font-size: 0.875rem;
      }

      .error-container {
        text-align: center;
        padding: 5rem 2rem;
        max-width: 600px;
        margin: 0 auto;
      }

      .error-icon {
        width: 5rem;
        height: 5rem;
        color: var(--warning-600);
        margin: 0 auto 1.5rem;
        stroke-width: 1.5;
      }

      .error-container h2 {
        color: var(--primary-900);
        margin-bottom: 0.75rem;
      }

      .error-container p {
        color: var(--primary-600);
        margin-bottom: 2rem;
      }

      @media (max-width: 968px) {
        .content-grid {
          grid-template-columns: 1fr;
        }

        .event-title {
          font-size: 2rem;
        }

        .ticket-card,
        .info-card {
          position: static;
        }
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
