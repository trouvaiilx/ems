// src/app/core/services/ticket.service.ts - BACKEND INTEGRATED

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  TicketType,
  PromotionalCode,
  TicketCategory,
  SeatingSection,
} from '../models/ticket.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private mapTicketTypeFromResponse(data: any): TicketType {
    return {
      id: data._id,
      eventId: data.eventId,
      category: data.category as TicketCategory,
      price: data.price,
      section: data.section as SeatingSection,
      maxTickets: data.maxTickets,
      soldTickets: data.soldTickets || 0,
      waitlistAllocation: data.waitlistAllocation || 0,
      availableTickets: data.maxTickets - (data.soldTickets || 0),
      seatConfig: data.seatConfig,
    };
  }

  private mapPromoCodeFromResponse(data: any): PromotionalCode {
    return {
      id: data._id,
      eventId: data.eventId,
      code: data.code,
      discountPercentage: data.discountPercentage,
      applicableCategories: data.applicableCategories as TicketCategory[],
      expiryDate: new Date(data.expiryDate),
      isActive: data.isActive,
    };
  }

  getTicketsByEvent(eventId: string): Observable<TicketType[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event/${eventId}`).pipe(
      map((tickets) => tickets.map((t) => this.mapTicketTypeFromResponse(t))),
      catchError((error) => {
        console.error('Get tickets error:', error);
        return throwError(() => new Error('Failed to fetch tickets'));
      })
    );
  }

  createTicketTypes(
    eventId: string,
    tickets: Omit<TicketType, 'id' | 'eventId' | 'soldTickets' | 'availableTickets'>[]
  ): Observable<TicketType[]> {
    // Create tickets one by one (backend doesn't support batch creation)
    const requests = tickets.map((ticket) =>
      this.http
        .post<any>(
          this.apiUrl,
          {
            eventId,
            category: ticket.category,
            price: ticket.price,
            section: ticket.section,
            maxTickets: ticket.maxTickets,
            seatConfig: ticket.seatConfig,
          },
          {
            headers: this.getAuthHeaders(),
          }
        )
        .pipe(map((response) => this.mapTicketTypeFromResponse(response)))
    );

    // Execute all requests and combine results
    return new Observable((observer) => {
      Promise.all(requests.map((req) => req.toPromise()))
        .then((results) => {
          observer.next(results.filter((r) => r !== undefined) as TicketType[]);
          observer.complete();
        })
        .catch((error) => {
          console.error('Create tickets error:', error);
          observer.error(new Error('Failed to create tickets'));
        });
    });
  }

  updateTicketType(id: string, updates: Partial<TicketType>): Observable<TicketType> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, updates, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((ticket) => this.mapTicketTypeFromResponse(ticket)),
        catchError((error) => {
          console.error('Update ticket error:', error);
          return throwError(() => new Error('Failed to update ticket'));
        })
      );
  }

  deleteTicketType(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Delete ticket error:', error);
          return throwError(() => new Error('Failed to delete ticket'));
        })
      );
  }

  createPromoCode(promo: Omit<PromotionalCode, 'id'>): Observable<PromotionalCode> {
    return this.http
      .post<any>(
        `${this.apiUrl}/promo`,
        {
          eventId: promo.eventId,
          code: promo.code,
          discountPercentage: promo.discountPercentage,
          applicableCategories: promo.applicableCategories,
          expiryDate: promo.expiryDate.toISOString(),
          isActive: promo.isActive,
        },
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        map((response) => this.mapPromoCodeFromResponse(response)),
        catchError((error) => {
          console.error('Create promo error:', error);
          return throwError(() => new Error('Failed to create promo code'));
        })
      );
  }

  updatePromoCode(id: string, updates: Partial<PromotionalCode>): Observable<PromotionalCode> {
    return this.http
      .put<any>(`${this.apiUrl}/promo/${id}`, updates, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => this.mapPromoCodeFromResponse(response)),
        catchError((error) => {
          console.error('Update promo error:', error);
          return throwError(() => new Error('Failed to update promo code'));
        })
      );
  }

  validatePromoCode(code: string, eventId: string): Observable<PromotionalCode | null> {
    return this.http
      .post<any>(`${this.apiUrl}/promo/verify`, {
        code,
        eventId,
      })
      .pipe(
        map((response) => (response ? this.mapPromoCodeFromResponse(response) : null)),
        catchError((error) => {
          console.error('Validate promo error:', error);
          // Return null instead of throwing error for invalid codes
          if (error.status === 404 || error.status === 400) {
            return [null];
          }
          return throwError(() => new Error('Failed to validate promo code'));
        })
      );
  }

  getPromoCode(eventId: string): Observable<PromotionalCode | null> {
    return this.http
      .get<any>(`${this.apiUrl}/promo/${eventId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => (response ? this.mapPromoCodeFromResponse(response) : null)),
        catchError((error) => {
          console.error('Get promo error:', error);
          return throwError(() => new Error('Failed to fetch promo code'));
        })
      );
  }

  calculateDiscount(amount: number, promoCode: PromotionalCode): number {
    return amount * (promoCode.discountPercentage / 100);
  }
}
