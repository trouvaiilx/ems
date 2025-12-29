// src/app/features/auth/register/register.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <div class="brand-section">
              <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              <h1>HELP Events</h1>
            </div>
            <p class="login-subtitle">Create your attendee account</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="fullName"
                  [(ngModel)]="userData.fullName"
                  name="fullName"
                  required
                  placeholder="Enter your full name"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <div class="input-wrapper">
                <input
                  type="email"
                  id="email"
                  [(ngModel)]="userData.email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="username">Username</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="username"
                  [(ngModel)]="userData.username"
                  name="username"
                  required
                  placeholder="Choose a username"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="phoneNumber">Phone Number</label>
              <div class="input-wrapper">
                <input
                  type="tel"
                  id="phoneNumber"
                  [(ngModel)]="userData.phoneNumber"
                  name="phoneNumber"
                  required
                  placeholder="Enter your phone number"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input
                  type="password"
                  id="password"
                  [(ngModel)]="userData.password"
                  name="password"
                  required
                  placeholder="Create a password"
                  class="form-input"
                />
              </div>
            </div>

            @if (errorMessage) {
            <div class="alert alert-error">
              <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
            }

            <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
              @if (loading) {
              <span class="spinner-sm"></span>
              }
              <span>{{ loading ? 'Registering...' : 'Register' }}</span>
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign In</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Reusing styles from login component for consistency */
      .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-100);
        padding: 2rem;
        position: relative;
        overflow: hidden;
      }

      .login-container {
        width: 100%;
        max-width: 480px;
        position: relative;
        z-index: 1;
      }

      .login-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        padding: 2.5rem;
        border: 1px solid var(--primary-200);
      }

      .login-header {
        margin-bottom: 2rem;
        text-align: center;
      }

      .brand-section {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }

      .brand-icon {
        width: 2.5rem;
        height: 2.5rem;
        color: var(--accent-600);
      }

      .brand-section h1 {
        font-size: 1.875rem;
        color: var(--primary-900);
        margin: 0;
      }

      .login-subtitle {
        color: var(--primary-600);
        font-size: 0.875rem;
        margin: 0;
      }

      .login-form {
        margin-bottom: 1.5rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .input-wrapper {
        position: relative;
      }

      .form-input {
        width: 100%;
        padding: 0.75rem 0.875rem;
        font-size: 0.875rem;
        border: 1px solid var(--primary-300);
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
      }

      .form-input:focus {
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .btn-block {
        width: 100%;
        justify-content: center;
        padding: 0.875rem;
        font-size: 0.9375rem;
        margin-top: 1rem;
      }

      .alert {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
      }

      .alert-error {
        background: var(--error-100);
        border: 1px solid var(--error-600);
        color: var(--error-700);
      }

      .alert-icon {
        width: 1rem;
        height: 1rem;
        flex-shrink: 0;
        margin-top: 0.125rem;
      }

      .auth-footer {
        text-align: center;
        margin-top: 1.5rem;
        color: var(--primary-600);
        font-size: 0.875rem;
      }

      .auth-footer a {
        color: var(--accent-600);
        font-weight: 500;
        text-decoration: none;
      }

      .auth-footer a:hover {
        text-decoration: underline;
      }

      .spinner-sm {
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
        display: inline-block;
        margin-right: 0.5rem;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class RegisterComponent {
  userData = {
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
  };

  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (user) => {
        // Redirtect to home (attendee dashboard) upon success
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
