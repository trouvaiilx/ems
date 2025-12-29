// src/app/core/services/waitlist.service.ts - BACKEND INTEGRATED

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Waitlist } from '../models/booking.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WaitlistService {
  private apiUrl = `${environment.apiUrl}/bookings/waitlist`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private mapWaitlistFromResponse(data: any): Waitlist {
    return {
      id: data._id,
      eventId: data.eventId,
      attendeeId: data.attendeeId,
      attendeeEmail: data.attendeeEmail,
      attendeePhone: data.attendeePhone,
      joinedAt: new Date(data.createdAt),
      notified: data.notified || false,
    };
  }

  joinWaitlist(
    eventId: string,
    attendeeId: string,
    email: string,
    phone: string
  ): Observable<Waitlist> {
    return this.http
      .post<any>(
        this.apiUrl,
        {
          eventId,
          email,
          phone,
        },
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        map((response) => this.mapWaitlistFromResponse(response)),
        catchError((error) => {
          console.error('Join waitlist error:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to join waitlist'));
        })
      );
  }

  leaveWaitlist(waitlistId: string): Observable<boolean> {
    // Note: Backend doesn't have leave waitlist endpoint yet
    return this.http
      .delete<any>(`${this.apiUrl}/${waitlistId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map(() => true),
        catchError((error) => {
          console.error('Leave waitlist error:', error);
          return throwError(() => new Error('Failed to leave waitlist'));
        })
      );
  }

  getWaitlistByEvent(eventId: string): Observable<Waitlist[]> {
    // Note: Backend doesn't have get waitlist endpoint yet
    return this.http
      .get<any[]>(`${this.apiUrl}/event/${eventId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((waitlist) => waitlist.map((w) => this.mapWaitlistFromResponse(w))),
        catchError((error) => {
          console.error('Get waitlist error:', error);
          return throwError(() => new Error('Failed to fetch waitlist'));
        })
      );
  }

  notifyNextInLine(eventId: string): Observable<Waitlist | null> {
    // Note: Backend doesn't have notify endpoint yet
    return this.http
      .post<any>(
        `${this.apiUrl}/notify`,
        {
          eventId,
        },
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        map((response) => (response ? this.mapWaitlistFromResponse(response) : null)),
        catchError((error) => {
          console.error('Notify waitlist error:', error);
          return throwError(() => new Error('Failed to notify waitlist'));
        })
      );
  }
}
