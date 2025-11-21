// src/app/app.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet />
      </main>
      <footer class="app-footer">
        <div class="footer-content">
          <p>&copy; 2025 HELP Events Management System. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .main-content {
        flex: 1;
      }

      .app-footer {
        background: #1f2937;
        color: var(--neutral-white);
        padding: 2rem;
        margin-top: auto;
      }

      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .footer-content p {
        margin: 0;
      }

      .footer-links {
        display: flex;
        gap: 2rem;
      }

      .footer-links a {
        color: var(--neutral-white);
        text-decoration: none;
        transition: color 0.3s;
      }

      .footer-links a:hover {
        color: var(--accent-600);
      }

      @media (max-width: 768px) {
        .footer-content {
          flex-direction: column;
          text-align: center;
        }

        .footer-links {
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    `,
  ],
})
export class App implements OnInit {
  ngOnInit(): void {
    // Initialize app
  }
}
