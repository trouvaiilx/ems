// src/app/shared/components/not-found/not-found.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div class="action-buttons">
          <a routerLink="/" class="btn btn-primary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
              />
            </svg>
            Go to Homepage
          </a>
          <button onclick="history.back()" class="btn btn-secondary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Go Back
          </button>
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
        background: var(--primary-200);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .error-illustration svg {
        width: 3.5rem;
        height: 3.5rem;
        color: var(--primary-600);
        stroke-width: 1.5;
      }

      h1 {
        font-size: 6rem;
        margin: 0;
        color: var(--accent-600);
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
export class NotFoundComponent {}
