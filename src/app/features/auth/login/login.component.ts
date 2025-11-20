// src/app/features/auth/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginCredentials, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
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
            <p class="login-subtitle">Sign in to your account</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label for="username">Username</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  id="username"
                  [(ngModel)]="credentials.username"
                  name="username"
                  required
                  placeholder="Enter your username"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  id="password"
                  [(ngModel)]="credentials.password"
                  name="password"
                  required
                  placeholder="Enter your password"
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
              <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
            </button>
          </form>

          <div class="demo-section">
            <div class="demo-header">
              <svg class="demo-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Demo Credentials</span>
            </div>
            <div class="demo-list">
              <div class="demo-item">
                <span class="demo-label">Administrator</span>
                <code class="demo-code">admin / password</code>
              </div>
              <div class="demo-item">
                <span class="demo-label">Organizer</span>
                <code class="demo-code">organizer1 / password</code>
              </div>
              <div class="demo-item">
                <span class="demo-label">Attendee</span>
                <code class="demo-code">attendee1 / password</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
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

      .login-page::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, var(--accent-300) 0%, transparent 70%);
        opacity: 0.3;
        pointer-events: none;
      }

      .login-container {
        width: 100%;
        max-width: 420px;
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
        margin-bottom: 2rem;
      }

      .form-group {
        margin-bottom: 1.25rem;
      }

      .input-wrapper {
        position: relative;
      }

      .input-icon {
        position: absolute;
        left: 0.875rem;
        top: 50%;
        transform: translateY(-50%);
        width: 1.25rem;
        height: 1.25rem;
        color: var(--primary-500);
        pointer-events: none;
      }

      .form-input {
        width: 100%;
        padding: 0.75rem 0.875rem 0.75rem 2.75rem;
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
      }

      .spinner-sm {
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
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

      .demo-section {
        padding: 1.25rem;
        background: var(--primary-100);
        border-radius: var(--radius-lg);
        border: 1px solid var(--primary-200);
      }

      .demo-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: var(--primary-700);
        font-weight: 500;
        font-size: 0.875rem;
      }

      .demo-icon {
        width: 1.125rem;
        height: 1.125rem;
        color: var(--primary-600);
      }

      .demo-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .demo-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.625rem 0.875rem;
        background: var(--neutral-white);
        border-radius: var(--radius-md);
        border: 1px solid var(--primary-200);
      }

      .demo-label {
        font-size: 0.8125rem;
        color: var(--primary-700);
        font-weight: 500;
      }

      .demo-code {
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.75rem;
        color: var(--primary-600);
        background: var(--primary-100);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
      }

      @media (max-width: 480px) {
        .login-card {
          padding: 2rem 1.5rem;
        }

        .demo-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
      }
    `,
  ],
})
export class LoginComponent {
  credentials: LoginCredentials = {
    username: '',
    password: '',
  };

  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        if (user.isFirstLogin) {
          this.router.navigate(['/change-password']);
        } else {
          this.redirectToDashboard(user.role);
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  private redirectToDashboard(role: UserRole): void {
    switch (role) {
      case UserRole.ADMIN:
        this.router.navigate(['/admin/dashboard']);
        break;
      case UserRole.ORGANIZER:
        this.router.navigate(['/organizer/dashboard']);
        break;
      case UserRole.ATTENDEE:
        this.router.navigate(['/home']);
        break;
    }
  }
}
