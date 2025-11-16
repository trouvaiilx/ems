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
        <div class="login-header">
          <h1>🎭 HELP Events</h1>
          <p>Event Management System</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              [(ngModel)]="credentials.username"
              name="username"
              required
              placeholder="Enter your username"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="credentials.password"
              name="password"
              required
              placeholder="Enter your password"
            />
          </div>

          @if (errorMessage) {
            <div class="error-message">
              {{ errorMessage }}
            </div>
          }

          <button type="submit" class="btn btn-primary" [disabled]="loading">
            @if (loading) {
              <span class="spinner"></span>
            }
            <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
          </button>
        </form>

        <div class="demo-credentials">
          <h3>Demo Credentials:</h3>
          <div class="credential-list">
            <div class="credential-item">
              <strong>Admin:</strong> admin / password
            </div>
            <div class="credential-item">
              <strong>Organizer:</strong> organizer1 / password
            </div>
            <div class="credential-item">
              <strong>Attendee:</strong> attendee1 / password
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .login-container {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 3rem;
      width: 100%;
      max-width: 450px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .login-header p {
      color: #666;
      font-size: 1.1rem;
    }

    .login-form {
      margin-bottom: 2rem;
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
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #6366f1;
    }

    .error-message {
      background: #fee2e2;
      color: #dc2626;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4f46e5;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .demo-credentials {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .demo-credentials h3 {
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .credential-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .credential-item {
      font-size: 0.875rem;
      color: #666;
    }

    .credential-item strong {
      color: #333;
      margin-right: 0.5rem;
    }
  `]
})
export class LoginComponent {
  credentials: LoginCredentials = {
    username: '',
    password: ''
  };
  
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
