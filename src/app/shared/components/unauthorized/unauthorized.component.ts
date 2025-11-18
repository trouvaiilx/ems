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
        <div class="error-illustration">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>
          You don't have permission to access this page. Please contact your administrator if you
          believe this is an error.
        </p>
        <div class="action-buttons">
          <a routerLink="/" class="btn btn-primary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .error-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-100);
        padding: 2rem;
      }

      .error-content {
        text-align: center;
        max-width: 600px;
      }

      .error-illustration {
        width: 6rem;
        height: 6rem;
        margin: 0 auto 2rem;
        background: var(--error-100);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .error-illustration svg {
        width: 3.5rem;
        height: 3.5rem;
        color: var(--error-600);
        stroke-width: 1.5;
      }

      h1 {
        font-size: 6rem;
        margin: 0;
        color: var(--error-600);
        font-weight: 700;
        line-height: 1;
      }

      h2 {
        font-size: 2rem;
        margin: 1rem 0 0.75rem 0;
        color: var(--primary-900);
      }

      p {
        color: var(--primary-600);
        margin: 0 0 2.5rem 0;
        font-size: 1.125rem;
        line-height: 1.6;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn svg {
        width: 1.125rem;
        height: 1.125rem;
      }

      @media (max-width: 480px) {
        h1 {
          font-size: 4rem;
        }

        h2 {
          font-size: 1.5rem;
        }

        .action-buttons {
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    `,
  ],
})
export class UnauthorizedComponent {}
