// src/app/features/auth/change-password/change-password.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ChangePasswordRequest, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="change-password-page">
      <div class="container">
        <div class="card">
          <h2>Change Password</h2>
          @if (isFirstLogin) {
            <p class="info-message">
              This is your first login. Please change your password to continue.
            </p>
          }

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                [(ngModel)]="request.currentPassword"
                name="currentPassword"
                required
              />
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                [(ngModel)]="request.newPassword"
                name="newPassword"
                required
                minlength="8"
              />
              <small>Password must be at least 8 characters</small>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                required
              />
            </div>

            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }

            @if (successMessage) {
              <div class="success-message">{{ successMessage }}</div>
            }

            <button type="submit" class="btn btn-primary" [disabled]="loading">
              {{ loading ? 'Changing Password...' : 'Change Password' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .change-password-page {
      min-height: 100vh;
      background: #f9fafb;
      padding: 2rem;
    }

    .container {
      max-width: 500px;
      margin: 0 auto;
    }

    .card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 2rem;
    }

    h2 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .info-message {
      background: #dbeafe;
      color: #1e40af;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    input:focus {
      outline: none;
      border-color: #6366f1;
    }

    small {
      display: block;
      margin-top: 0.25rem;
      color: #666;
      font-size: 0.875rem;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .success-message {
      background: #d1fae5;
      color: #065f46;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .btn {
      width: 100%;
      padding: 0.875rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
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

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ChangePasswordComponent {
  request: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: ''
  };
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isFirstLogin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser();
    this.isFirstLogin = user?.isFirstLogin || false;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.request.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    if (this.request.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      return;
    }

    this.loading = true;

    this.authService.changePassword(this.request).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully';
        setTimeout(() => {
          const user = this.authService.getCurrentUser();
          if (user) {
            this.redirectToDashboard(user.role);
          }
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Failed to change password';
        this.loading = false;
      }
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
