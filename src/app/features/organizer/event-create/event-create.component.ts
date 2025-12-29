// src/app/features/organizer/event-create/event-create.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateEventRequest } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-event-page">
      <div class="container">
        <div class="page-header">
          <h1>Create New Event</h1>
          <p>Fill in the details to create your event</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="event-form">
          <div class="card">
            <h3>Event Information</h3>

            <div class="form-group">
              <label for="name">Event Name *</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="eventData.name"
                name="name"
                required
                placeholder="Enter event name"
              />
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea
                id="description"
                [(ngModel)]="eventData.description"
                name="description"
                required
                rows="5"
                placeholder="Describe your event"
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
                  [min]="minDate"
                  (change)="checkDateAvailability()"
                />
                @if (dateCheckMessage) {
                <small [class.error]="!isDateAvailable" [class.success]="isDateAvailable">
                  {{ dateCheckMessage }}
                </small>
                }
              </div>

              <div class="form-group">
                <label for="time">Event Time *</label>
                <input type="time" id="time" [(ngModel)]="eventData.time" name="time" required />
              </div>
            </div>

            <div class="form-group">
              <label>Event Poster</label>
              <div class="upload-options">
                <button
                  type="button"
                  class="toggle-btn"
                  [class.active]="uploadType === 'url'"
                  (click)="setUploadType('url')"
                >
                  Image URL
                </button>
                <button
                  type="button"
                  class="toggle-btn"
                  [class.active]="uploadType === 'file'"
                  (click)="setUploadType('file')"
                >
                  Upload Image
                </button>
              </div>

              @if (uploadType === 'url') {
              <input
                type="url"
                id="poster"
                [(ngModel)]="eventData.posterUrl"
                name="poster"
                placeholder="https://example.com/poster.jpg"
                (change)="updateUrlPreview()"
              />
              } @else {
              <div class="file-upload-container">
                <input
                  type="file"
                  id="fileUpload"
                  (change)="onFileSelected($event)"
                  accept="image/png, image/jpeg, image/jpg"
                  class="file-input"
                />
                <small>Max size: 1MB. Formats: JPG, PNG</small>
              </div>
              } @if (previewUrl) {
              <div class="poster-preview">
                <img [src]="previewUrl" alt="Poster preview" />
                @if (uploadType === 'file') {
                <button type="button" class="btn-remove" (click)="clearFile()">×</button>
                }
              </div>
              }
            </div>
          </div>

          @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
          } @if (successMessage) {
          <div class="success-message">{{ successMessage }}</div>
          }

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="loading || !isDateAvailable">
              {{ loading ? 'Creating Event...' : 'Create Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .create-event-page {
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
        color: var(--primary-900);
      }

      .page-header p {
        color: var(--primary-600);
        margin: 0;
      }

      .card {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        margin-bottom: 2rem;
        border: 1px solid var(--primary-200);
      }

      .card h3 {
        margin: 0 0 1.5rem 0;
        color: var(--primary-900);
        font-size: 1.25rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
        }
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--primary-900);
        font-size: 0.875rem;
      }

      input,
      textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--primary-200);
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: border-color 0.3s;
        font-family: inherit;
      }

      input:focus,
      textarea:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      small {
        display: block;
        margin-top: 0.5rem;
        font-size: 0.875rem;
      }

      small.error {
        color: var(--error-600);
      }

      small.success {
        color: #059669;
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
        display: block;
      }

      .error-message {
        background: #fee2e2;
        color: var(--error-600);
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
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
        font-size: 0.9375rem;
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

      .btn-secondary:hover {
        background: var(--primary-300);
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .upload-options {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .toggle-btn {
        padding: 0.5rem 1rem;
        border: 1px solid var(--primary-200);
        background: var(--neutral-white);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-weight: 500;
        color: var(--primary-600);
      }

      .toggle-btn.active {
        background: var(--primary-100);
        border-color: var(--accent-500);
        color: var(--accent-600);
      }

      .file-input {
        padding: 0.5rem;
        border: 2px dashed var(--primary-300);
        background: var(--primary-100);
      }

      .btn-remove {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .poster-preview {
        position: relative;
      }
    `,
  ],
})
export class EventCreateComponent {
  eventData: CreateEventRequest = {
    name: '',
    description: '',
    date: new Date(),
    time: '',
    posterUrl: '',
  };

  eventDate = '';
  minDate = new Date().toISOString().split('T')[0];
  loading = false;
  errorMessage = '';
  successMessage = '';
  dateCheckMessage = '';
  isDateAvailable = true;

  uploadType: 'url' | 'file' = 'url';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  setUploadType(type: 'url' | 'file'): void {
    this.uploadType = type;
    this.previewUrl = type === 'url' ? this.eventData.posterUrl || null : null;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        // 1MB
        this.errorMessage = 'File size exceeds 1MB limit.';
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  clearFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    const input = document.getElementById('fileUpload') as HTMLInputElement;
    if (input) input.value = '';
  }

  // Update preview when URL changes
  updateUrlPreview(): void {
    if (this.uploadType === 'url') {
      this.previewUrl = this.eventData.posterUrl || null;
    }
  }

  checkDateAvailability(): void {
    if (!this.eventDate) return;

    this.dateCheckMessage = 'Checking availability...';
    this.eventService.isDateAvailable(new Date(this.eventDate)).subscribe({
      next: (available) => {
        this.isDateAvailable = available;
        this.dateCheckMessage = available ? '✓ Date is available' : '✗ This date is already booked';
      },
    });
  }

  onSubmit(): void {
    if (
      !this.eventData.name ||
      !this.eventData.description ||
      !this.eventDate ||
      !this.eventData.time
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (!this.isDateAvailable) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.eventData.date = new Date(this.eventDate);
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.errorMessage = 'User not authenticated';
      this.loading = false;
      return;
    }

    let requestData: CreateEventRequest | FormData;

    if (this.uploadType === 'file' && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.eventData.name);
      formData.append('description', this.eventData.description);
      formData.append('date', this.eventData.date.toISOString());
      formData.append('time', this.eventData.time);
      formData.append('image', this.selectedFile);
      requestData = formData;
    } else {
      requestData = this.eventData;
    }

    this.eventService.createEvent(requestData, user.id, user.fullName).subscribe({
      next: (event) => {
        this.successMessage = 'Event created successfully!';
        setTimeout(() => {
          this.router.navigate(['/organizer/events', event.id, 'tickets']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Failed to create event. Please try again.';
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/organizer/dashboard']);
  }
}
