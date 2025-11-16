// src/app/core/services/booking.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Booking, BookingStatus, CreateBookingRequest } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  createBooking(request: CreateBookingRequest, attendeeId: string, attendeeName: string, attendeeEmail: string): Observable<Booking> {
    // Generate QR code (in real app, this would be done server-side)
    const qrCode = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      eventId: request.eventId,
      eventName: 'Event Name', // Would be fetched from event service
      attendeeId,
      attendeeName,
      attendeeEmail,
      tickets: [], // Would be populated from ticket details
      totalAmount: 0,
      discountApplied: 0,
      finalAmount: 0,
      promoCode: request.promoCode,
      qrCode,
      status: BookingStatus.PENDING,
      bookingDate: new Date(),
      checkedIn: false
    };

    return of(newBooking).pipe(
      delay(500),
      map(booking => {
        const current = this.bookingsSubject.value;
        this.bookingsSubject.next([...current, booking]);
        return booking;
      })
    );
  }

  confirmBooking(bookingId: string): Observable<Booking> {
    return of(bookingId).pipe(
      delay(500),
      map(id => {
        const current = this.bookingsSubject.value;
        const index = current.findIndex(b => b.id === id);
        if (index !== -1) {
          current[index].status = BookingStatus.CONFIRMED;
          this.bookingsSubject.next([...current]);
          return current[index];
        }
        throw new Error('Booking not found');
      })
    );
  }

  cancelBooking(bookingId: string): Observable<boolean> {
    return of(bookingId).pipe(
      delay(500),
      map(id => {
        const current = this.bookingsSubject.value;
        const index = current.findIndex(b => b.id === id);
        if (index !== -1) {
          const booking = current[index];
          const eventDate = new Date(booking.eventName); // In real app, get from event
          const daysDifference = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          
          if (daysDifference >= 7) {
            current[index].status = BookingStatus.CANCELLED;
            this.bookingsSubject.next([...current]);
            return true;
          }
          throw new Error('Cannot cancel booking less than 7 days before event');
        }
        throw new Error('Booking not found');
      })
    );
  }

  getBookingsByAttendee(attendeeId: string): Observable<Booking[]> {
    return this.bookings$.pipe(
      delay(300),
      map(bookings => bookings.filter(b => b.attendeeId === attendeeId))
    );
  }

  checkInBooking(qrCode: string): Observable<Booking> {
    return of(qrCode).pipe(
      delay(500),
      map(code => {
        const current = this.bookingsSubject.value;
        const index = current.findIndex(b => b.qrCode === code);
        if (index !== -1) {
          current[index].checkedIn = true;
          current[index].checkedInAt = new Date();
          this.bookingsSubject.next([...current]);
          return current[index];
        }
        throw new Error('Invalid QR code');
      })
    );
  }
}
