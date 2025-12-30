import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-carousel">
          @for (event of carouselEvents; track event.id; let i = $index) {
          <div class="carousel-img-wrapper" [class.active]="i === currentHeroImageIndex">
            <img [src]="event.posterUrl" class="carousel-img" alt="Background" />
            <div class="carousel-overlay"></div>
          </div>
          }
        </div>
        <div class="hero-container">
          <div class="hero-content">
            <h1 class="hero-title">Experience Professional Events</h1>
            <p class="hero-description">
              Discover and book tickets for premier concerts, conferences, and workshops at HELP
              Events Auditorium
            </p>
            <div class="hero-actions">
              <a routerLink="/events" class="btn btn-primary btn-lg">
                Browse Events
                <svg class="icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div class="hero-visual">
            @if (carouselEvents.length > 0) {
            <div class="visual-card">
              <div class="visual-card-header">
                <span class="visual-badge">{{
                  carouselEvents[currentHeroImageIndex]?.status || 'Live'
                }}</span>
                <span class="visual-date">{{
                  carouselEvents[currentHeroImageIndex]?.date | date : 'MMM dd'
                }}</span>
              </div>
              <div class="visual-card-content">
                <h4>{{ carouselEvents[currentHeroImageIndex]?.name }}</h4>
                <p>{{ carouselEvents[currentHeroImageIndex]?.organizerName }}</p>
                <p class="visual-time">{{ carouselEvents[currentHeroImageIndex]?.time }}</p>
              </div>
            </div>
            }
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Why Choose HELP Events</h2>
            <p class="section-description">Professional event management at your fingertips</p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <h3 class="feature-title">Easy Booking</h3>
              <p class="feature-description">
                Streamlined ticket booking process with secure payment options
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 class="feature-title">Seat Selection</h3>
              <p class="feature-description">
                Choose your preferred seats from premium venue sections
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 class="feature-title">Digital Tickets</h3>
              <p class="feature-description">Instant QR code tickets delivered via email</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="feature-title">Promotional Codes</h3>
              <p class="feature-description">Access exclusive discounts and special pricing</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Events Section -->
      <section class="upcoming-events">
        <div class="container">
          <div class="section-header-inline">
            <div>
              <h2 class="section-title">Upcoming Events</h2>
              <p class="section-description">Don't miss these amazing experiences</p>
            </div>
            <a routerLink="/events" class="btn btn-outline">View All</a>
          </div>

          @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading events...</p>
          </div>
          } @else if (upcomingEvents.length > 0) {
          <div class="events-grid">
            @for (event of upcomingEvents.slice(0, 3); track event.id) {
            <article class="event-card">
              @if (event.posterUrl) {
              <div class="event-image" [style.background-image]="'url(' + event.posterUrl + ')'">
                <div class="event-overlay"></div>
              </div>
              } @else {
              <div class="event-image event-placeholder">
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
                <div class="event-meta">
                  <time class="event-date">{{ event.date | date : 'MMM dd, yyyy' }}</time>
                  <span class="event-separator">•</span>
                  <span class="event-time">{{ event.time }}</span>
                </div>
                <h3 class="event-title">{{ event.name }}</h3>
                <p class="event-description">{{ event.description }}</p>
                <div class="event-footer">
                  <span class="event-organizer">{{ event.organizerName }}</span>
                  <a [routerLink]="['/events', event.id]" class="event-link">
                    View Details
                    <svg class="icon-sm" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
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
            <h3>No Upcoming Events</h3>
            <p>Check back soon for new events!</p>
          </div>
          }
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Experience Amazing Events?</h2>
            <p class="cta-description">Browse our upcoming events and secure your tickets today</p>
            <a routerLink="/events" class="btn btn-primary btn-lg">Explore Events</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .home-page {
        min-height: 100vh;
      }

      /* Hero Section */
      .hero {
        background: linear-gradient(135deg, var(--accent-700) 0%, var(--accent-900) 100%);
        color: var(--neutral-white);
        padding: 6rem 2rem 8rem;
        position: relative;
        overflow: hidden;
      }

      .hero::before {
        background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%);
        pointer-events: none;
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      .hero-carousel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
      }

      .carousel-img-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 1s ease-in-out;
      }

      .carousel-img-wrapper.active {
        opacity: 1;
      }

      .carousel-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .carousel-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6); /* Dim the background */
      }

      .hero-container {
        position: relative;
        z-index: 2;
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
        position: relative;
      }

      .hero-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        letter-spacing: -0.05em;
        line-height: 1.1;
      }

      .hero-description {
        font-size: 1.125rem;
        line-height: 1.7;
        opacity: 0.95;
        margin-bottom: 2rem;
        color: var(--accent-300);
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
      }

      .btn-lg {
        padding: 0.875rem 1.75rem;
        font-size: 1rem;
      }

      .hero-visual {
        position: relative;
      }

      .visual-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        padding: 1.5rem;
        animation: float 3s ease-in-out infinite;
        min-width: 300px;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      .visual-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .visual-badge {
        background: var(--error-100);
        color: var(--error-700);
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .visual-date {
        color: var(--primary-600);
        font-weight: 600;
      }

      .visual-time {
        margin-top: 0.5rem;
        font-size: 0.8rem;
        color: var(--neutral-500);
      }

      .visual-card-content h4 {
        color: var(--primary-900);
        margin-bottom: 0.5rem;
        font-weight: 700;
      }

      .visual-card-content p {
        color: var(--primary-600);
        font-size: 0.875rem;
      }

      /* Features Section */
      .features {
        padding: 5rem 2rem;
        background: var(--neutral-white);
      }

      .section-header {
        text-align: center;
        margin-bottom: 4rem;
      }

      .section-title {
        color: var(--primary-900);
        margin-bottom: 0.75rem;
      }

      .section-description {
        color: var(--primary-600);
        font-size: 1.125rem;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
      }

      .feature-card {
        text-align: center;
        padding: 2rem;
        border-radius: var(--radius-lg);
        transition: all var(--transition-base);
      }

      .feature-card:hover {
        transform: translateY(-4px);
      }

      .feature-icon {
        width: 3.5rem;
        height: 3.5rem;
        margin: 0 auto 1.5rem;
        padding: 0.875rem;
        background: var(--accent-300);
        border-radius: var(--radius-lg);
        color: var(--accent-800);
      }

      .feature-icon svg {
        width: 100%;
        height: 100%;
      }

      .feature-title {
        color: var(--primary-900);
        margin-bottom: 0.75rem;
        font-size: 1.125rem;
      }

      .feature-description {
        color: var(--primary-600);
        line-height: 1.6;
      }

      /* Upcoming Events */
      .upcoming-events {
        padding: 5rem 2rem;
        background: var(--primary-100);
      }

      .section-header-inline {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3rem;
      }

      .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        justify-content: center; /* Center cards if they don't fill the row */
      }

      /* ... */

      @media (max-width: 968px) {
        .hero-container {
          grid-template-columns: 1fr;
          text-align: center;
          gap: 2rem; /* Reduce gap on mobile */
        }

        .hero-title {
          font-size: 2.25rem;
        }

        .hero-actions {
          justify-content: center; /* Center buttons on mobile */
        }

        .hero-visual {
          display: none;
        }

        .section-header-inline {
          flex-direction: column;
          align-items: center; /* Center header */
          text-align: center;
          gap: 1.5rem;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  upcomingEvents: Event[] = [];
  loading = true;

  carouselEvents: Event[] = [];
  currentHeroImageIndex = 0;
  carouselInterval: any;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  loadUpcomingEvents(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.upcomingEvents = events;

        // Setup carousel events (filter events with posters)
        this.carouselEvents = events.filter((e) => e.posterUrl);

        if (this.carouselEvents.length > 0) {
          this.startCarousel();
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.currentHeroImageIndex = (this.currentHeroImageIndex + 1) % this.carouselEvents.length;
    }, 5000);
  }
}
