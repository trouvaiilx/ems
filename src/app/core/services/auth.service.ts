// src/app/core/services/auth.service.ts

import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRole, LoginCredentials, ChangePasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private readonly STORAGE_KEY = 'ems_current_user';

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    // Simulate API call
    return of(this.mockLogin(credentials)).pipe(
      delay(500),
      map(user => {
        if (user) {
          this.setCurrentUser(user);
          return user;
        }
        throw new Error('Invalid credentials');
      })
    );
  }

  private mockLogin(credentials: LoginCredentials): User | null {
    // Mock users for demonstration
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@ems.com',
        username: 'admin',
        fullName: 'System Administrator',
        phoneNumber: '+60123456789',
        role: UserRole.ADMIN,
        isFirstLogin: false,
        createdAt: new Date()
      },
      {
        id: '2',
        email: 'organizer@ems.com',
        username: 'organizer1',
        fullName: 'John Organizer',
        phoneNumber: '+60123456788',
        organizationName: 'Event Co.',
        role: UserRole.ORGANIZER,
        isFirstLogin: true,
        createdAt: new Date()
      },
      {
        id: '3',
        email: 'attendee@ems.com',
        username: 'attendee1',
        fullName: 'Jane Attendee',
        phoneNumber: '+60123456787',
        role: UserRole.ATTENDEE,
        isFirstLogin: false,
        createdAt: new Date()
      }
    ];

    return mockUsers.find(u => u.username === credentials.username) || null;
  }

  changePassword(request: ChangePasswordRequest): Observable<boolean> {
    // Simulate API call
    return of(true).pipe(
      delay(500),
      map(() => {
        const user = this.currentUserSubject.value;
        if (user && user.isFirstLogin) {
          user.isFirstLogin = false;
          this.setCurrentUser(user);
        }
        return true;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }
}
