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
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">All Events</h1>
          <p class="page-description">Discover amazing events at HELP Events Auditorium</p>
        </div>
      </div>

      <div class="container">
        <div class="filters-section">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterEvents()"
              placeholder="Search events..."
              class="search-input"
            />
          </div>
          <div class="sort-box">
            <label for="sort">Sort by</label>
            <select
              id="sort"
              [(ngModel)]="sortBy"
              (ngModelChange)="sortEvents()"
              class="sort-select"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading events...</p>
        </div>
        } @else if (filteredEvents.length > 0) {
        <div class="events-list">
          @for (event of filteredEvents; track event.id) {
          <article class="event-item">
            <div class="event-image-container">
              @if (event.posterUrl) {
              <div
                class="event-image"
                [style.background-image]="'url(' + event.posterUrl + ')'"
              ></div>
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
              <span class="event-month-badge">{{ event.date | date : 'MMM' }}</span>
            </div>
            <div class="event-content">
              <div class="event-date-badge">
                <svg class="date-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <time>{{ event.date | date : 'MMM dd, yyyy' }}</time>
                <span class="date-separator">•</span>
                <svg class="time-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ event.time }}</span>
              </div>
              <h2 class="event-title">{{ event.name }}</h2>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-footer">
                <div class="organizer-info">
                  <svg class="organizer-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ event.organizerName }}</span>
                </div>
                <a [routerLink]="['/events', event.id]" class="btn btn-primary">
                  View Details
                  <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3>No Events Found</h3>
          <p>Try adjusting your search or check back later for new events</p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .event-list-page {
        min-height: 100vh;
        background: var(--primary-100);
        padding-bottom: 4rem;
      }

      .page-header {
        background: linear-gradient(135deg, var(--accent-700) 0%, var(--accent-900) 100%);
        color: var(--neutral-white);
        padding: 3rem 2rem;
        margin-bottom: 2rem;
      }

      .page-title {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }

      .page-description {
        font-size: 1.125rem;
        color: var(--accent-300);
        margin: 0;
      }

      .filters-section {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        background: var(--neutral-white);
        padding: 1.25rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
      }

      .search-box {
        flex: 1;
        position: relative;
      }

      .search-icon {
        position: absolute;
        left: 0.875rem;
        top: 50%;
        transform: translateY(-50%);
        width: 1.25rem;
        height: 1.25rem;
        color: var(--primary-500);
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 0.75rem 0.875rem 0.75rem 2.75rem;
        border: 1px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        transition: all var(--transition-fast);
      }

      .search-input:focus {
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .sort-box {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .sort-box label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--primary-700);
        margin: 0;
      }

      .sort-select {
        padding: 0.75rem 2.5rem 0.75rem 0.875rem;
        border: 1px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        background: var(--neutral-white);
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.25rem;
      }

      .events-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .event-item {
        display: grid;
        grid-template-columns: 280px 1fr;
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: all var(--transition-base);
        border: 1px solid var(--primary-200);
      }

      .event-item:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
        border-color: var(--accent-300);
      }

      .event-image-container {
        position: relative;
      }

      .event-image {
        height: 100%;
        min-height: 200px;
        background-size: cover;
        background-position: center;
      }

      .event-placeholder {
        background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-600) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .event-placeholder svg {
        width: 4rem;
        height: 4rem;
        color: var(--neutral-white);
      }

      .event-month-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--neutral-white);
        color: var(--accent-600);
        padding: 0.5rem 0.875rem;
        border-radius: var(--radius-md);
        font-weight: 600;
        font-size: 0.875rem;
        text-transform: uppercase;
        box-shadow: var(--shadow-md);
      }

      .event-content {
        padding: 1.75rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .event-date-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--primary-600);
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

      .date-icon,
      .time-icon {
        width: 1.125rem;
        height: 1.125rem;
        color: var(--primary-500);
      }

      .date-separator {
        color: var(--primary-400);
      }

      .event-title {
        font-size: 1.5rem;
        color: var(--primary-900);
        margin: 0;
        line-height: 1.3;
      }

      .event-description {
        color: var(--primary-700);
        line-height: 1.6;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .event-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid var(--primary-200);
      }

      .organizer-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary-700);
        font-size: 0.875rem;
      }

      .organizer-icon {
        width: 1.125rem;
        height: 1.125rem;
        color: var(--primary-500);
      }

      .btn-icon {
        width: 1rem;
        height: 1rem;
        margin-left: 0.25rem;
      }

      @media (max-width: 968px) {
        .event-item {
          grid-template-columns: 1fr;
        }

        .event-image {
          min-height: 180px;
        }

        .filters-section {
          flex-direction: column;
        }

        .sort-box {
          justify-content: space-between;
        }
      }
    `,
  ],
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

  loadEvents(keyword?: string): void {
    this.loading = true;
    const filters: any = {};
    if (keyword) filters.keyword = keyword;

    // We want upcoming events mostly, but the backend filter logic for dates allows us to be specific.
    // However, getUpcomingEvents acts as a CLIENT side filter on getAllEvents result in the service previously.
    // Now getAllEvents returns published events.
    // Let's just use getAllEvents directly with filters.

    // Default to future dates?
    // The previous getUpcomingEvents filtered for date >= now.
    filters.startDate = new Date().toISOString();

    this.eventService.getAllEvents(filters).subscribe({
      next: (events) => {
        this.events = events;
        // filteredEvents is now just events because filtering happened on server
        this.filteredEvents = events;
        this.sortEvents();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  filterEvents(): void {
    // rudimentary debounce could be added here
    this.loadEvents(this.searchTerm);
  }

  sortEvents(): void {
    if (this.sortBy === 'date') {
      this.filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (this.sortBy === 'name') {
      this.filteredEvents.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
}
