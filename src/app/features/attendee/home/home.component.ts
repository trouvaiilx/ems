// src/app/features/attendee/home/home.component.ts

import { Component, OnInit } from '@angular/core';
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
        <div class="hero-content">
          <h1>Experience Unforgettable Events</h1>
          <p>Discover and book tickets for the most exciting concerts, conferences, and workshops at HELP Events Auditorium</p>
          <a routerLink="/events" class="btn btn-hero">Browse Events</a>
        </div>
        <div class="hero-image">
          <div class="floating-card">🎭</div>
          <div class="floating-card delay-1">🎵</div>
          <div class="floating-card delay-2">🎤</div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <h2>Why Choose HELP Events?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🎫</div>
              <h3>Easy Booking</h3>
              <p>Book your tickets in just a few clicks with our streamlined booking process</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💺</div>
              <h3>Seat Selection</h3>
              <p>Choose your preferred seats from Balcony, Mezzanine, or Stall sections</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Digital Tickets</h3>
              <p>Receive QR code tickets instantly via email for hassle-free entry</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎁</div>
              <h3>Special Discounts</h3>
              <p>Enjoy promotional codes and special pricing for various categories</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Events Section -->
      <section class="upcoming-events">
        <div class="container">
          <div class="section-header">
            <h2>Upcoming Events</h2>
            <a routerLink="/events" class="view-all">View All →</a>
          </div>

          @if (loading) {
            <div class="loading">Loading events...</div>
          } @else if (upcomingEvents.length > 0) {
            <div class="events-grid">
              @for (event of upcomingEvents.slice(0, 3); track event.id) {
                <div class="event-card">
                  @if (event.posterUrl) {
                    <div class="event-image" [style.background-image]="'url(' + event.posterUrl + ')'"></div>
                  } @else {
                    <div class="event-image placeholder">🎭</div>
                  }
                  <div class="event-content">
                    <h3>{{ event.name }}</h3>
                    <p class="event-date">
                      📅 {{ event.date | date:'fullDate' }} • {{ event.time }}
                    </p>
                    <p class="event-description">{{ event.description }}</p>
                    <a [routerLink]="['/events', event.id]" class="btn btn-outline">
                      View Details →
                    </a>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="no-events">
              <p>No upcoming events at the moment. Check back soon!</p>
            </div>
          }
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container">
          <h2>Ready to Experience Amazing Events?</h2>
          <p>Browse our upcoming events and book your tickets today!</p>
          <a routerLink="/events" class="btn btn-primary">Explore Events</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6rem 2rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      min-height: 600px;
    }

    @media (max-width: 768px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }

    .hero-content h1 {
      font-size: 3.5rem;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .hero-content p {
      font-size: 1.25rem;
      margin: 0 0 2rem 0;
      opacity: 0.9;
    }

    .btn-hero {
      background: white;
      color: #667eea;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .btn-hero:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    .hero-image {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }

    .floating-card {
      position: absolute;
      font-size: 4rem;
      animation: float 3s ease-in-out infinite;
    }

    .floating-card.delay-1 {
      animation-delay: 0.5s;
      left: 20%;
    }

    .floating-card.delay-2 {
      animation-delay: 1s;
      right: 20%;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .features {
      padding: 5rem 2rem;
      background: #f9fafb;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin: 0 0 3rem 0;
      color: #333;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .feature-card p {
      margin: 0;
      color: #666;
    }

    .upcoming-events {
      padding: 5rem 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      margin: 0;
      color: #333;
    }

    .view-all {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .view-all:hover {
      color: #4f46e5;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .event-card {
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .event-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }

    .event-image {
      height: 200px;
      background-size: cover;
      background-position: center;
    }

    .event-image.placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
    }

    .event-content {
      padding: 1.5rem;
    }

    .event-content h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .event-date {
      color: #6366f1;
      margin: 0 0 1rem 0;
      font-weight: 500;
    }

    .event-description {
      color: #666;
      margin: 0 0 1rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .btn-outline {
      display: inline-block;
      padding: 0.5rem 1.5rem;
      border: 2px solid #6366f1;
      color: #6366f1;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-outline:hover {
      background: #6366f1;
      color: white;
    }

    .loading,
    .no-events {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .cta {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 5rem 2rem;
      text-align: center;
    }

    .cta h2 {
      font-size: 2.5rem;
      margin: 0 0 1rem 0;
    }

    .cta p {
      font-size: 1.25rem;
      margin: 0 0 2rem 0;
      opacity: 0.9;
    }

    .btn-primary {
      background: white;
      color: #667eea;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      display: inline-block;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
  `]
})
export class HomeComponent implements OnInit {
  upcomingEvents: Event[] = [];
  loading = true;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.upcomingEvents = events;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
