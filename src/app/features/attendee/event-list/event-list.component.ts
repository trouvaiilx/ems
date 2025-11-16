// src/app/features/attendee/event-list/event-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { Event, EventStatus } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="event-list-page">
      <div class="container">
        <div class="page-header">
          <h1>All Events</h1>
          <p>Discover amazing events happening at HELP Events Auditorium</p>
        </div>

        <div class="filters">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterEvents()"
            placeholder="Search events..."
            class="search-input"
          />
          <select [(ngModel)]="sortBy" (ngModelChange)="sortEvents()" class="sort-select">
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        @if (loading) {
          <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading events...</p>
          </div>
        } @else if (filteredEvents.length > 0) {
          <div class="events-grid">
            @for (event of filteredEvents; track event.id) {
              <div class="event-card">
                @if (event.posterUrl) {
                  <div class="event-image" [style.background-image]="'url(' + event.posterUrl + ')'">
                    <div class="event-badge">{{ getEventMonth(event.date) }}</div>
                  </div>
                } @else {
                  <div class="event-image placeholder">
                    <span class="event-icon">🎭</span>
                    <div class="event-badge">{{ getEventMonth(event.date) }}</div>
                  </div>
                }
                <div class="event-details">
                  <div class="event-date">
                    <span class="date-day">{{ event.date | date:'dd' }}</span>
                    <span class="date-info">
                      <span class="month">{{ event.date | date:'MMM' }}</span>
                      <span class="year">{{ event.date | date:'yyyy' }}</span>
                    </span>
                  </div>
                  <div class="event-info">
                    <h3>{{ event.name }}</h3>
                    <p class="event-time">🕐 {{ event.time }}</p>
                    <p class="event-organizer">👤 {{ event.organizerName }}</p>
                    <p class="event-description">{{ event.description }}</p>
                    <a [routerLink]="['/events', event.id]" class="btn btn-primary">
                      View Details & Book
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="no-results">
            <div class="empty-icon">🔍</div>
            <h3>No Events Found</h3>
            <p>Try adjusting your search or check back later for new events.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .event-list-page {
      min-height: 100vh;
      background: #f9fafb;
      padding: 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-header h1 {
      font-size: 3rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .page-header p {
      font-size: 1.25rem;
      color: #666;
      margin: 0;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }
    }

    .search-input,
    .sort-select {
      flex: 1;
      padding: 0.875rem 1.25rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .search-input:focus,
    .sort-select:focus {
      outline: none;
      border-color: #6366f1;
    }

    .events-grid {
      display: grid;
      gap: 2rem;
    }

    .event-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s;
      display: grid;
      grid-template-columns: 300px 1fr;
      height: 250px;
    }

    @media (max-width: 768px) {
      .event-card {
        grid-template-columns: 1fr;
        height: auto;
      }
    }

    .event-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .event-image {
      position: relative;
      background-size: cover;
      background-position: center;
      height: 100%;
    }

    .event-image.placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .event-icon {
      font-size: 5rem;
    }

    .event-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255,255,255,0.95);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 700;
      color: #6366f1;
      text-transform: uppercase;
      font-size: 0.875rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .event-details {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
    }

    .event-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      padding: 1rem;
      border-radius: 0.5rem;
      min-width: 80px;
      height: fit-content;
    }

    .date-day {
      font-size: 2.5rem;
      font-weight: 700;
      color: #6366f1;
      line-height: 1;
    }

    .date-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 0.25rem;
    }

    .month {
      font-weight: 600;
      color: #333;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .year {
      font-size: 0.75rem;
      color: #666;
    }

    .event-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .event-info h3 {
      margin: 0 0 0.75rem 0;
      color: #333;
      font-size: 1.5rem;
    }

    .event-time,
    .event-organizer {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .event-description {
      color: #666;
      margin: 0.5rem 0 1rem 0;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      text-align: center;
      transition: all 0.3s;
      width: fit-content;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover {
      background: #4f46e5;
      transform: translateX(5px);
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

    .no-results {
      text-align: center;
      padding: 5rem 2rem;
    }

    .empty-icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }

    .no-results h3 {
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .no-results p {
      color: #666;
      margin: 0;
    }
  `]
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = true;
  searchTerm = '';
  sortBy = 'date';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = events;
        this.sortEvents();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterEvents(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEvents = this.events.filter(event =>
      event.name.toLowerCase().includes(term) ||
      event.description.toLowerCase().includes(term) ||
      event.organizerName.toLowerCase().includes(term)
    );
    this.sortEvents();
  }

  sortEvents(): void {
    if (this.sortBy === 'date') {
      this.filteredEvents.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (this.sortBy === 'name') {
      this.filteredEvents.sort((a, b) => 
        a.name.localeCompare(b.name)
      );
    }
  }

  getEventMonth(date: Date): string {
    return new Date(date).toLocaleString('en-US', { month: 'short' }).toUpperCase();
  }
}
