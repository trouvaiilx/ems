// src/app/features/organizer/event-edit/event-edit.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-event-page">
      <div class="container">
        @if (event) {
          <div class="page-header">
            <h1>Edit Event</h1>
            <p>Update details for {{ event.name }}</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="event-form">
            <div class="card">
              <h3>Event Information</h3>
              
              <div class="form-group">
                <label for="name">Event Name *</label>
                <input
                  type="text"
                  id="name"
                  [(ngModel)]="event.name"
                  name="name"
                  required
                />
              </div>

              <div class="form-group">
                <label for="description">Description *</label>
                <textarea
                  id="description"
                  [(ngModel)]="event.description"
                  name="description"
                  required
                  rows="5"
                ></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="date">Event Date *</label>
                  <input
                    type="date"
                    id="date"
                    [(ngModel)]="eventDate"
                    name="date"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="time">Event Time *</label>
                  <input
                    type="time"
                    id="time"
                    [(ngModel)]="event.time"
                    name="time"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="poster">Event Poster URL (Optional)</label>
                <input
                  type="url"
                  id="poster"
                  [(ngModel)]="event.posterUrl"
                  name="poster"
                />
                @if (event.posterUrl) {
                  <div class="poster-preview">
                    <img [src]="event.posterUrl" alt="Event poster" />
                  </div>
                }
              </div>

              <div class="form-group">
                <label>Event Status</label>
                <div class="status-options">
                  <label class="radio-option">
                    <input 
                      type="radio" 
                      [(ngModel)]="event.status" 
                      name="status" 
                      value="DRAFT"
                    />
                    <span>Draft</span>
                  </label>
                  <label class="radio-option">
                    <input 
                      type="radio" 
                      [(ngModel)]="event.status" 
                      name="status" 
                      value="PUBLISHED"
                    />
                    <span>Published</span>
                  </label>
                  <label class="radio-option">
                    <input 
                      type="radio" 
                      [(ngModel)]="event.status" 
                      name="status" 
                      value="CANCELLED"
                    />
                    <span>Cancelled</span>
                  </label>
                </div>
              </div>
            </div>

            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }

            @if (successMessage) {
              <div class="success-message">{{ successMessage }}</div>
            }

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="onCancel()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="loading">
                {{ loading ? 'Saving Changes...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        } @else {
          <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading event...</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .edit-event-page {
      min-height: 100vh;
      background: #f9fafb;
      padding: 2rem;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
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

    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    input,
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
    }

    input:focus,
    textarea:focus {
      outline: none;
      border-color: #6366f1;
    }

    .poster-preview {
      margin-top: 1rem;
      border-radius: 0.5rem;
      overflow: hidden;
      max-width: 400px;
    }

    .poster-preview img {
      width: 100%;
      height: auto;
    }

    .status-options {
      display: flex;
      gap: 1.5rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .radio-option input[type="radio"] {
      width: auto;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .success-message {
      background: #d1fae5;
      color: #065f46;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4f46e5;
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
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EventEditComponent implements OnInit {
  event: Event | undefined;
  eventDate = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe({
        next: (event) => {
          this.event = event;
          this.eventDate = new Date(event!.date).toISOString().split('T')[0];
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.event) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updates = {
      ...this.event,
      date: new Date(this.eventDate)
    };

    this.eventService.updateEvent(this.event.id, updates).subscribe({
      next: () => {
        this.successMessage = 'Event updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/organizer/dashboard']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Failed to update event';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/organizer/dashboard']);
  }
}
