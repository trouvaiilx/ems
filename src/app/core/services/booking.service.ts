// src/app/core/services/booking.service.ts - BACKEND INTEGRATED

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Booking, BookingStatus, CreateBookingRequest } from '../models/booking.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private mapBookingFromResponse(data: any): Booking {
    return {
      id: data._id,
      eventId: data.eventId,
      eventName: data.eventName,
      eventDate: new Date(data.eventDate),
      attendeeId: data.attendeeId,
      attendeeName: data.attendeeName,
      attendeeEmail: data.attendeeEmail,
      tickets: data.tickets.map((t: any) => ({
        ticketTypeId: t.ticketTypeId,
        category: t.category,
        section: t.section,
        seatNumber: t.seatNumber,
        price: t.price,
      })),
      totalAmount: data.totalAmount,
      discountApplied: data.discountApplied || 0,
      finalAmount: data.finalAmount,
      promoCode: data.promoCode,
      qrCode: data.qrCode,
      status: data.status as BookingStatus,
      bookingDate: new Date(data.createdAt),
      checkedIn: data.checkedIn || false,
      checkedInAt: data.checkedInAt ? new Date(data.checkedInAt) : undefined,
    };
  }

  createBooking(
    request: CreateBookingRequest,
    attendeeId: string,
    attendeeName: string,
    attendeeEmail: string,
    eventName: string,
    eventDate: Date,
    totalAmount: number,
    discountApplied: number,
    finalAmount: number
  ): Observable<Booking> {
    const payload = {
      eventId: request.eventId,
      tickets: request.tickets.map((t) => ({
        ticketTypeId: t.ticketTypeId,
        quantity: t.quantity,
        seatNumbers: t.seatNumbers,
      })),
      promoCode: request.promoCode,
    };

    return this.http
      .post<any>(this.apiUrl, payload, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => this.mapBookingFromResponse(response)),
        catchError((error) => {
          console.error('Create booking error:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to create booking'));
        })
      );
  }

  processPayment(bookingId: string): Observable<Booking> {
    return this.http
      .post<any>(
        `${this.apiUrl}/pay`,
        { bookingId },
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        map((response) => this.mapBookingFromResponse(response.booking)),
        catchError((error) => {
          console.error('Payment error:', error);
          return throwError(() => new Error(error.error?.message || 'Payment failed'));
        })
      );
  }

  confirmBooking(bookingId: string): Observable<Booking> {
    // Backend auto-confirms bookings, so this just fetches the booking
    // This might be redundant now with processPayment but kept for compatibility
    return this.getBookingById(bookingId);
  }

  cancelBooking(bookingId: string): Observable<boolean> {
    // Note: Backend doesn't have cancel endpoint yet, you'll need to add it
    // For now, this is a placeholder
    return this.http
      .put<any>(
        `${this.apiUrl}/${bookingId}/cancel`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        map(() => true),
        catchError((error) => {
          console.error('Cancel booking error:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to cancel booking'));
        })
      );
  }

  getBookingsByAttendee(attendeeId: string): Observable<Booking[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/my`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((bookings) => bookings.map((b) => this.mapBookingFromResponse(b))),
        catchError((error) => {
          console.error('Get bookings error:', error);
          return throwError(() => new Error('Failed to fetch bookings'));
        })
      );
  }

  getBookingById(bookingId: string): Observable<Booking> {
    return this.http
      .get<any>(`${this.apiUrl}/${bookingId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((booking) => this.mapBookingFromResponse(booking)),
        catchError((error) => {
          console.error('Get booking error:', error);
          return throwError(() => new Error('Failed to fetch booking'));
        })
      );
  }

  getEventBookings(eventId: string): Observable<Booking[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/event/${eventId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((bookings) => bookings.map((b) => this.mapBookingFromResponse(b))),
        catchError((error) => {
          console.error('Get event bookings error:', error);
          return throwError(() => new Error('Failed to fetch event bookings'));
        })
      );
  }

  getBookedSeats(eventId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/event/${eventId}/seats`);
  }

  checkInBooking(qrCode: string): Observable<Booking> {
    // Note: Backend doesn't have check-in endpoint yet, you'll need to add it
    return this.http
      .put<any>(
        `${this.apiUrl}/checkin`,
        { qrCode },
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        map((booking) => this.mapBookingFromResponse(booking)),
        catchError((error) => {
          console.error('Check-in error:', error);
          return throwError(() => new Error(error.error?.message || 'Invalid QR code'));
        })
      );
  }

  downloadTicket(bookingId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${bookingId}/download`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
    });
  }
}
