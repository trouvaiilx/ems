// src/app/core/services/auth.service.ts - BACKEND INTEGRATED

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User, UserRole, LoginCredentials, ChangePasswordRequest } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  organizationName?: string;
  role: UserRole;
  token: string;
  isFirstLogin?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEY = 'ems_current_user';
  private readonly TOKEN_KEY = 'ems_token';
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        const user: User = {
          id: response._id,
          email: response.email,
          username: response.username,
          fullName: response.fullName || response.username,
          phoneNumber: response.phoneNumber || '',
          organizationName: response.organizationName,
          role: response.role,
          isFirstLogin: response.isFirstLogin || false,
          createdAt: new Date(),
        };

        // Store token and user
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this.setCurrentUser(user);

        return user;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      })
    );
  }

  register(userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    organizationName?: string;
  }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      map((response) => {
        const user: User = {
          id: response._id,
          email: response.email,
          username: response.username,
          fullName: response.fullName || response.username,
          phoneNumber: response.phoneNumber || '',
          organizationName: response.organizationName,
          role: response.role,
          isFirstLogin: true,
          createdAt: new Date(),
        };

        localStorage.setItem(this.TOKEN_KEY, response.token);
        this.setCurrentUser(user);

        return user;
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http
      .get<any>(`${this.apiUrl}/me`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => ({
          id: response._id,
          email: response.email,
          username: response.username,
          fullName: response.fullName || response.username,
          phoneNumber: response.phoneNumber || '',
          organizationName: response.organizationName,
          role: response.role,
          isFirstLogin: response.isFirstLogin || false,
          createdAt: new Date(response.createdAt),
        })),
        tap((user) => this.setCurrentUser(user)),
        catchError((error) => {
          console.error('Get profile error:', error);
          return throwError(() => new Error('Failed to fetch profile'));
        })
      );
  }

  changePassword(request: ChangePasswordRequest): Observable<boolean> {
    // Note: Backend doesn't have this endpoint yet, so this is a placeholder
    // You'll need to add this endpoint to the backend
    return this.http
      .put<any>(`${this.apiUrl}/change-password`, request, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map(() => {
          const user = this.currentUserSubject.value;
          if (user && user.isFirstLogin) {
            user.isFirstLogin = false;
            this.setCurrentUser(user);
          }
          return true;
        }),
        catchError((error) => {
          console.error('Change password error:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to change password'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
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
    return this.currentUserSubject.value !== null && !!localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
