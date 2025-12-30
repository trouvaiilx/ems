// src/app/shared/components/navbar/navbar.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <a routerLink="/" class="brand-link">
            <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span class="brand-text">HELP Events</span>
          </a>
        </div>

        <!-- Desktop Menu -->
        <div class="navbar-menu desktop-only">
          <a routerLink="/home" routerLinkActive="active" class="nav-link">Home</a>
          <a routerLink="/events" routerLinkActive="active" class="nav-link">Events</a>

          @if (currentUser) { @if (currentUser.role === UserRole.ADMIN) {
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">Admin</a>
          } @if (currentUser.role === UserRole.ORGANIZER) {
          <a routerLink="/organizer/dashboard" routerLinkActive="active" class="nav-link"
            >Dashboard</a
          >
          } @if (currentUser.role === UserRole.ATTENDEE) {
          <a routerLink="/my-tickets" routerLinkActive="active" class="nav-link">My Tickets</a>
          } }
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            @if (isMobileMenuOpen) {
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
            } @else {
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            }
          </svg>
        </button>

        <div class="navbar-actions desktop-only">
          @if (currentUser) {
          <div class="user-menu">
            <button class="user-button" (click)="toggleUserMenu(); $event.stopPropagation()">
              <div class="user-avatar">
                <span>{{ getUserInitials() }}</span>
              </div>
              <div class="user-info">
                <span class="user-name">{{ currentUser.fullName }}</span>
                <span class="user-role">{{ getUserRoleLabel(currentUser.role) }}</span>
              </div>
              <svg class="chevron-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            @if (showUserMenu) {
            <div class="dropdown-menu">
              <div class="dropdown-header">
                <div class="dropdown-user-name">{{ currentUser.fullName }}</div>
                <div class="dropdown-user-email">{{ currentUser.email }}</div>
              </div>
              <div class="dropdown-divider"></div>
              <a routerLink="/change-password" class="dropdown-item" (click)="closeUserMenu()">
                <svg class="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Change Password
              </a>
              <button (click)="logout()" class="dropdown-item logout-item">
                <svg class="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                Sign Out
              </button>
            </div>
            }
          </div>
          } @else {
          <a routerLink="/login" class="btn btn-primary">Sign In</a>
          }
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      @if (isMobileMenuOpen) {
      <div class="mobile-menu">
        <a
          routerLink="/home"
          routerLinkActive="active"
          class="mobile-nav-link"
          (click)="closeMobileMenu()"
          >Home</a
        >
        <a
          routerLink="/events"
          routerLinkActive="active"
          class="mobile-nav-link"
          (click)="closeMobileMenu()"
          >Events</a
        >

        @if (currentUser) {
        <div class="mobile-divider"></div>
        <div class="mobile-user-info">
          <div class="user-avatar small">
            <span>{{ getUserInitials() }}</span>
          </div>
          <div class="user-details">
            <span class="name">{{ currentUser.fullName }}</span>
            <span class="email">{{ currentUser.email }}</span>
          </div>
        </div>

        @if (currentUser.role === UserRole.ADMIN) {
        <a
          routerLink="/admin/dashboard"
          routerLinkActive="active"
          class="mobile-nav-link"
          (click)="closeMobileMenu()"
          >Admin Dashboard</a
        >
        } @if (currentUser.role === UserRole.ORGANIZER) {
        <a
          routerLink="/organizer/dashboard"
          routerLinkActive="active"
          class="mobile-nav-link"
          (click)="closeMobileMenu()"
          >Organizer Dashboard</a
        >
        } @if (currentUser.role === UserRole.ATTENDEE) {
        <a
          routerLink="/my-tickets"
          routerLinkActive="active"
          class="mobile-nav-link"
          (click)="closeMobileMenu()"
          >My Tickets</a
        >
        }

        <a routerLink="/change-password" class="mobile-nav-link" (click)="closeMobileMenu()"
          >Change Password</a
        >
        <button (click)="logout()" class="mobile-nav-link logout">Sign Out</button>
        } @else {
        <div class="mobile-divider"></div>
        <a routerLink="/login" class="mobile-nav-link primary" (click)="closeMobileMenu()"
          >Sign In</a
        >
        }
      </div>
      }
    </nav>
  `,
  styles: [
    `
      .navbar {
        background: var(--neutral-white);
        border-bottom: 1px solid var(--primary-200);
        position: sticky;
        top: 0;
        z-index: 1000;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.95);
      }

      .navbar-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 4rem;
      }

      .navbar-brand .brand-link {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        text-decoration: none;
        color: var(--primary-900);
        font-weight: 600;
        font-size: 1.125rem;
        transition: color var(--transition-fast);
      }

      .brand-icon {
        width: 2rem;
        height: 2rem;
        color: var(--accent-600);
      }

      .brand-text {
        font-family: var(--font-display);
        letter-spacing: -0.025em;
      }

      .navbar-menu {
        display: flex;
        gap: 0.25rem;
        align-items: center;
      }

      .nav-link {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--primary-700);
        text-decoration: none;
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        position: relative;
      }

      .nav-link:hover {
        color: var(--accent-600);
        background: var(--primary-100);
      }

      .nav-link.active {
        color: var(--accent-600);
        background: var(--accent-300);
      }

      .navbar-actions {
        position: relative;
      }

      .user-menu {
        position: relative;
      }

      .user-button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        background: transparent;
        border: 1px solid var(--primary-200);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .user-button:hover {
        background: var(--primary-100);
        border-color: var(--primary-300);
      }

      .user-avatar {
        width: 2rem;
        height: 2rem;
        border-radius: var(--radius-md);
        background: linear-gradient(135deg, var(--accent-600), var(--accent-800));
        color: var(--neutral-white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.75rem;
        flex-shrink: 0;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.125rem;
      }

      .user-name {
        font-weight: 500;
        font-size: 0.875rem;
        color: var(--primary-900);
        line-height: 1.2;
      }

      .user-role {
        font-size: 0.75rem;
        color: var(--primary-600);
        line-height: 1;
      }

      .chevron-icon {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--primary-500);
        transition: transform var(--transition-fast);
      }

      .user-button:hover .chevron-icon {
        transform: translateY(2px);
      }

      .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        min-width: 16rem;
        background: var(--neutral-white);
        border: 1px solid var(--primary-200);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        overflow: hidden;
        animation: fadeIn var(--transition-fast);
      }

      .dropdown-header {
        padding: 1rem;
        background: var(--primary-100);
      }

      .dropdown-user-name {
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--primary-900);
        margin-bottom: 0.25rem;
      }

      .dropdown-user-email {
        font-size: 0.75rem;
        color: var(--primary-600);
      }

      .dropdown-divider {
        height: 1px;
        background: var(--primary-200);
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        color: var(--primary-700);
        background: transparent;
        border: none;
        cursor: pointer;
        text-decoration: none;
        transition: all var(--transition-fast);
        text-align: left;
      }

      .dropdown-item:hover {
        background: var(--primary-100);
        color: var(--primary-900);
      }

      .dropdown-icon {
        width: 1.125rem;
        height: 1.125rem;
        color: var(--primary-500);
      }

      .logout-item {
        color: var(--error-600);
      }

      .logout-item:hover {
        background: var(--error-100);
        color: var(--error-700);
      }

      .logout-item .dropdown-icon {
        color: var(--error-600);
      }

      /* Mobile Menu Styles */
      .mobile-menu-toggle {
        display: none;
        background: transparent;
        border: none;
        color: var(--primary-700);
        width: 40px;
        height: 40px;
        padding: 8px;
        cursor: pointer;
        border-radius: var(--radius-md);
      }

      .mobile-menu-toggle:hover {
        background: var(--primary-100);
        color: var(--accent-600);
      }

      .mobile-menu {
        position: fixed;
        top: 4rem; /* Height of navbar */
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ffffff; /* Force white background */
        z-index: 2000; /* Increase z-index to ensure it covers content */
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border-top: 1px solid var(--primary-200);
        animation: slideDown 0.3s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .mobile-nav-link {
        padding: 1rem;
        font-size: 1rem;
        font-weight: 500;
        color: var(--primary-700);
        text-decoration: none;
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        display: block;
      }

      .mobile-nav-link:hover,
      .mobile-nav-link.active {
        background: var(--primary-100);
        color: var(--accent-600);
      }

      .mobile-divider {
        height: 1px;
        background: var(--primary-200);
        margin: 0.5rem 0;
      }

      .mobile-user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--primary-50);
        border-radius: var(--radius-lg);
        margin-bottom: 0.5rem;
      }

      .mobile-user-info .user-avatar.small {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 0.875rem;
      }

      .user-details {
        display: flex;
        flex-direction: column;
      }

      .user-details .name {
        font-weight: 600;
        color: var(--primary-900);
      }

      .user-details .email {
        font-size: 0.75rem;
        color: var(--primary-600);
      }

      .mobile-nav-link.logout {
        color: var(--error-600);
        background: transparent;
        border: none;
        text-align: left;
        width: 100%;
        cursor: pointer;
      }

      .mobile-nav-link.logout:hover {
        background: var(--error-50);
      }

      .mobile-nav-link.primary {
        background: var(--accent-600);
        color: white;
        text-align: center;
        margin-top: 1rem;
      }

      .mobile-nav-link.primary:hover {
        background: var(--accent-700);
      }

      @media (max-width: 768px) {
        .navbar-container {
          padding: 0 1rem;
        }

        .desktop-only {
          display: none !important;
        }

        .mobile-menu-toggle {
          display: block;
        }
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  showUserMenu = false;
  isMobileMenuOpen = false;
  UserRole = UserRole;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenu = target.closest('.user-menu');
    const mobileMenu = target.closest('.mobile-menu');
    const mobileToggle = target.closest('.mobile-menu-toggle');

    if (!userMenu && this.showUserMenu) {
      this.showUserMenu = false;
    }

    if (!mobileMenu && !mobileToggle && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const names = this.currentUser.fullName.split(' ');
    // Handle single name case
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return names
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getUserRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Administrator',
      [UserRole.ORGANIZER]: 'Organizer',
      [UserRole.ATTENDEE]: 'Attendee',
    };
    return labels[role];
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close user menu if open when toggling mobile menu
    if (this.isMobileMenuOpen) {
      this.showUserMenu = false;
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.isMobileMenuOpen = false;
  }
}
