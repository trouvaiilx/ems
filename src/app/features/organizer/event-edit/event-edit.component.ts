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
              <input type="text" id="name" [(ngModel)]="event.name" name="name" required />
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
                <input type="date" id="date" [(ngModel)]="eventDate" name="date" required />
              </div>

              <div class="form-group">
                <label for="time">Event Time *</label>
                <input type="time" id="time" [(ngModel)]="event.time" name="time" required />
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
                [(ngModel)]="event.posterUrl"
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
                <img [src]="previewUrl" alt="Event poster" />
                @if (uploadType === 'file') {
                <button type="button" class="btn-remove" (click)="clearFile()">×</button>
                }
              </div>
              }
            </div>

            <div class="form-group">
              <label>Event Status</label>
              <div class="status-options">
                <label class="radio-option">
                  <input type="radio" [(ngModel)]="event.status" name="status" value="DRAFT" />
                  <span>Draft</span>
                </label>
                <label class="radio-option">
                  <input type="radio" [(ngModel)]="event.status" name="status" value="PUBLISHED" />
                  <span>Published</span>
                </label>
                <label class="radio-option">
                  <input type="radio" [(ngModel)]="event.status" name="status" value="CANCELLED" />
                  <span>Cancelled</span>
                </label>
              </div>
            </div>
          </div>

          @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
          } @if (successMessage) {
          <div class="success-message">{{ successMessage }}</div>
          }

          <div class="form-actions display-flex space-between">
            <button type="button" class="btn btn-danger" (click)="onDelete()">Delete Event</button>
            <div class="right-actions">
              <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="loading">
                {{ loading ? 'Saving Changes...' : 'Save Changes' }}
              </button>
            </div>
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
  styles: [
    `
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
        color: var(--primary-900);
      }

      input,
      textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--primary-200);
        border-radius: 0.5rem;
        font-size: 1rem;
        font-family: inherit;
      }

      input:focus,
      textarea:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

      .radio-option input[type='radio'] {
        width: auto;
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
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
      }

      .right-actions {
        display: flex;
        gap: 1rem;
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

      .btn-danger {
        background: var(--error-100);
        color: var(--error-700);
      }

      .btn-danger:hover {
        background: var(--error-200);
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
        border-top: 4px solid var(--accent-600);
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

      @media (max-width: 768px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column;
          gap: 1rem;
        }

        .right-actions {
          width: 100%;
          justify-content: flex-end;
        }

        .btn-danger {
          width: 100%;
        }
      }
    `,
  ],
})
export class EventEditComponent implements OnInit {
  event: Event | undefined;
  eventDate = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  uploadType: 'url' | 'file' = 'url';
  selectedFile: File | null = null;
  previewUrl: string | null = null;

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
          this.previewUrl = event?.posterUrl || null;
        },
      });
    }
  }

  setUploadType(type: 'url' | 'file'): void {
    this.uploadType = type;
    this.previewUrl = type === 'url' ? this.event?.posterUrl || null : null;
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
    if (this.uploadType === 'url' && this.event) {
      this.previewUrl = this.event.posterUrl || null;
    }
  }

  onSubmit(): void {
    if (!this.event) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updates: any = {
      ...this.event,
      date: new Date(this.eventDate),
    };

    let payload: any | FormData;

    if (this.uploadType === 'file' && this.selectedFile) {
      const formData = new FormData();
      formData.append('name', this.event.name);
      formData.append('description', this.event.description);
      formData.append('date', new Date(this.eventDate).toISOString());
      formData.append('time', this.event.time);
      formData.append('status', this.event.status);
      if (this.event.posterUrl) {
        formData.append('posterUrl', this.event.posterUrl);
      }
      formData.append('image', this.selectedFile);
      payload = formData;
    } else {
      payload = updates;
    }

    this.eventService.updateEvent(this.event.id, payload).subscribe({
      next: () => {
        this.successMessage = 'Event updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/organizer/dashboard']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Failed to update event';
        this.loading = false;
      },
    });
  }

  onDelete(): void {
    if (
      !this.event ||
      !confirm('Are you sure you want to delete this event? This action cannot be undone.')
    )
      return;

    this.loading = true;
    this.eventService.deleteEvent(this.event.id).subscribe({
      next: () => {
        this.router.navigate(['/organizer/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to delete event';
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/organizer/dashboard']);
  }
}
