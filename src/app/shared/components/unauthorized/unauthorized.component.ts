// src/app/shared/components/unauthorized/unauthorized.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="error-page">
      <div class="error-content">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <a routerLink="/" class="btn btn-primary">Go to Homepage</a>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f9fafb;
      padding: 2rem;
    }

    .error-content {
      text-align: center;
    }

    h1 {
      font-size: 6rem;
      margin: 0;
      color: #6366f1;
      font-weight: 700;
    }

    h2 {
      font-size: 2rem;
      margin: 1rem 0;
      color: #333;
    }

    p {
      color: #666;
      margin: 0 0 2rem 0;
    }

    .btn {
      padding: 0.875rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      display: inline-block;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover {
      background: #4f46e5;
      transform: translateY(-2px);
    }
  `]
})
export class UnauthorizedComponent {}
