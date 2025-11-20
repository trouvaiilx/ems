// src/app/features/admin/register-organizer/register-organizer.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface OrganizerRegistrationForm {
  fullName: string;
  email: string;
  phoneNumber: string;
  organizationName: string;
}

@Component({
  selector: 'app-register-organizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="header">
        <h1>Register Event Organizer</h1>
        <p>Create a new account for an event organizer</p>
      </div>

      <div class="card">
        <form (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label for="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                [(ngModel)]="form.fullName"
                name="fullName"
                required
                placeholder="Enter full name"
              />
            </div>

            <div class="form-group">
              <label for="email">Email Address *</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="form.email"
                name="email"
                required
                placeholder="organizer@example.com"
              />
            </div>

            <div class="form-group">
              <label for="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                [(ngModel)]="form.phoneNumber"
                name="phoneNumber"
                required
                placeholder="+60123456789"
              />
            </div>

            <div class="form-group">
              <label for="organizationName">Organization Name</label>
              <input
                type="text"
                id="organizationName"
                [(ngModel)]="form.organizationName"
                name="organizationName"
                placeholder="Enter organization name (optional)"
              />
            </div>
          </div>

          @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
          } @if (successMessage) {
          <div class="success-message">
            <h4>✓ Registration Successful!</h4>
            <p>{{ successMessage }}</p>
            <div class="credentials-info">
              <strong>Login Credentials:</strong>
              <div>Username: {{ generatedUsername }}</div>
              <div>Password: {{ generatedPassword }}</div>
              <small>(An email has been sent to the organizer)</small>
            </div>
          </div>
          }

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              {{ loading ? 'Registering...' : 'Register Organizer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        min-height: 100vh;
        background: var(--primary-100);
      }

      .header {
        margin-bottom: 2rem;
      }

      .header h1 {
        margin: 0 0 0.5rem 0;
        color: var(--primary-900);
        font-size: 2.5rem;
      }

      .header p {
        color: var(--primary-600);
        margin: 0;
        font-size: 1.125rem;
      }

      .card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        padding: 2rem;
        border: 1px solid var(--primary-200);
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      label {
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--primary-900);
        font-size: 0.875rem;
      }

      input {
        padding: 0.75rem;
        border: 2px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all var(--transition-fast);
      }

      input:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .error-message {
        background: var(--error-100);
        color: var(--error-700);
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
        border: 1px solid var(--error-600);
        font-size: 0.875rem;
      }

      .success-message {
        background: var(--success-100);
        border: 1px solid var(--success-600);
        color: var(--success-700);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        margin-bottom: 1.5rem;
      }

      .success-message h4 {
        margin: 0 0 0.5rem 0;
        color: var(--success-700);
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .credentials-info {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--neutral-white);
        border-radius: var(--radius-md);
        font-family: monospace;
        font-size: 0.875rem;
      }

      .credentials-info strong {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--success-700);
      }

      .credentials-info small {
        display: block;
        margin-top: 0.5rem;
        color: var(--success-600);
        font-size: 0.8125rem;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }

      .btn {
        padding: 0.75rem 1.5rem;
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
    `,
  ],
})
export class RegisterOrganizerComponent {
  form: OrganizerRegistrationForm = {
    fullName: '',
    email: '',
    phoneNumber: '',
    organizationName: '',
  };

  loading = false;
  errorMessage = '';
  successMessage = '';
  generatedUsername = '';
  generatedPassword = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      // Generate credentials
      this.generatedUsername = this.generateUsername(this.form.fullName);
      this.generatedPassword = this.generatePassword();

      this.successMessage =
        `Account created successfully for ${this.form.fullName}. ` +
        `A welcome email with login credentials has been sent to ${this.form.email}.`;

      this.loading = false;

      // Reset form after 5 seconds
      setTimeout(() => {
        this.resetForm();
      }, 5000);
    }, 1000);
  }

  validateForm(): boolean {
    if (!this.form.fullName || !this.form.email || !this.form.phoneNumber) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    if (!this.isValidEmail(this.form.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  generateUsername(fullName: string): string {
    return fullName.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 100);
  }

  generatePassword(): string {
    return 'TempPass' + Math.floor(Math.random() * 10000);
  }

  resetForm(): void {
    this.form = {
      fullName: '',
      email: '',
      phoneNumber: '',
      organizationName: '',
    };
    this.successMessage = '';
    this.generatedUsername = '';
    this.generatedPassword = '';
  }

  onCancel(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
