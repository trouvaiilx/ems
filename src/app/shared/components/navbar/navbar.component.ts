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
      <div class="container">
        <div class="navbar-brand">
          <a routerLink="/" class="logo">
            <span class="logo-icon">🎭</span>
            <span class="logo-text">HELP Events</span>
          </a>
        </div>

        <div class="navbar-menu">
          <a routerLink="/home" routerLinkActive="active">Home</a>
          <a routerLink="/events" routerLinkActive="active">Events</a>
          
          @if (currentUser) {
            @if (currentUser.role === UserRole.ADMIN) {
              <a routerLink="/admin/dashboard" routerLinkActive="active">Admin</a>
            }
            @if (currentUser.role === UserRole.ORGANIZER) {
              <a routerLink="/organizer/dashboard" routerLinkActive="active">Dashboard</a>
            }
            @if (currentUser.role === UserRole.ATTENDEE) {
              <a routerLink="/my-tickets" routerLinkActive="active">My Tickets</a>
            }
          }
        </div>

        <div class="navbar-actions">
          @if (currentUser) {
            <div class="user-menu">
              <button class="user-button" (click)="toggleUserMenu()">
                <span class="user-avatar">{{ getUserInitials() }}</span>
                <span class="user-name">{{ currentUser.fullName }}</span>
                <span class="chevron">▼</span>
              </button>
              
              @if (showUserMenu) {
                <div class="dropdown-menu">
                  <div class="user-info">
                    <div class="user-name">{{ currentUser.fullName }}</div>
                    <div class="user-email">{{ currentUser.email }}</div>
                  </div>
                  <div class="divider"></div>
                  <a routerLink="/change-password" class="menu-item">Change Password</a>
                  <button (click)="logout()" class="menu-item logout">Logout</button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/login" class="btn btn-primary">Login</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: #333;
      font-weight: 600;
      font-size: 1.5rem;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
    }

    .navbar-menu a {
      text-decoration: none;
      color: #666;
      font-weight: 500;
      transition: color 0.3s;
    }

    .navbar-menu a:hover,
    .navbar-menu a.active {
      color: #6366f1;
    }

    .navbar-actions {
      position: relative;
    }

    .btn {
      padding: 0.5rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover {
      background: #4f46e5;
    }

    .user-menu {
      position: relative;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: white;
      border: 1px solid #e5e7eb;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .user-button:hover {
      border-color: #6366f1;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-name {
      font-weight: 500;
      color: #333;
    }

    .chevron {
      font-size: 0.75rem;
      color: #999;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      min-width: 200px;
      overflow: hidden;
    }

    .user-info {
      padding: 1rem;
      background: #f9fafb;
    }

    .user-info .user-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .user-info .user-email {
      font-size: 0.875rem;
      color: #666;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
    }

    .menu-item {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      text-align: left;
      text-decoration: none;
      color: #333;
      background: none;
      border: none;
      cursor: pointer;
      transition: background 0.3s;
    }

    .menu-item:hover {
      background: #f9fafb;
    }

    .menu-item.logout {
      color: #ef4444;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  showUserMenu = false;
  UserRole = UserRole;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return '';
    const names = this.currentUser.fullName.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }
}
