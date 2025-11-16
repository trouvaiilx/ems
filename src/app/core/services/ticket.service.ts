// src/app/core/services/ticket.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TicketType, PromotionalCode, SeatingLayout, TicketCategory, SeatingSection } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private ticketsSubject = new BehaviorSubject<TicketType[]>([]);
  public tickets$ = this.ticketsSubject.asObservable();

  private promosSubject = new BehaviorSubject<PromotionalCode[]>([]);
  public promos$ = this.promosSubject.asObservable();

  private mockTickets: TicketType[] = [
    {
      id: '1',
      eventId: '1',
      category: TicketCategory.GENERAL_ADMISSION,
      price: 150,
      section: SeatingSection.STALL,
      maxTickets: 200,
      soldTickets: 45,
      availableTickets: 155
    },
    {
      id: '2',
      eventId: '1',
      category: TicketCategory.VIP,
      price: 350,
      section: SeatingSection.BALCONY,
      maxTickets: 50,
      soldTickets: 48,
      availableTickets: 2
    }
  ];

  private mockPromos: PromotionalCode[] = [
    {
      id: '1',
      eventId: '1',
      code: 'EARLY2025',
      discountPercentage: 20,
      applicableCategories: [TicketCategory.GENERAL_ADMISSION, TicketCategory.VIP],
      expiryDate: new Date('2025-12-01'),
      isActive: true
    }
  ];

  constructor() {
    this.ticketsSubject.next(this.mockTickets);
    this.promosSubject.next(this.mockPromos);
  }

  getTicketsByEvent(eventId: string): Observable<TicketType[]> {
    return this.tickets$.pipe(
      delay(300),
      map(tickets => tickets.filter(t => t.eventId === eventId))
    );
  }

  createTicketTypes(eventId: string, tickets: Omit<TicketType, 'id' | 'eventId' | 'soldTickets' | 'availableTickets'>[]): Observable<TicketType[]> {
    const newTickets: TicketType[] = tickets.map(t => ({
      id: Date.now().toString() + Math.random(),
      eventId,
      ...t,
      soldTickets: 0,
      availableTickets: t.maxTickets
    }));

    return of(newTickets).pipe(
      delay(500),
      map(tickets => {
        const current = this.ticketsSubject.value;
        this.ticketsSubject.next([...current, ...tickets]);
        return tickets;
      })
    );
  }

  updateSeatingLayout(eventId: string, layout: SeatingLayout): Observable<boolean> {
    // Save seating configuration
    return of(true).pipe(delay(300));
  }

  createPromoCode(promo: Omit<PromotionalCode, 'id'>): Observable<PromotionalCode> {
    const newPromo: PromotionalCode = {
      id: Date.now().toString(),
      ...promo
    };

    return of(newPromo).pipe(
      delay(500),
      map(promo => {
        const current = this.promosSubject.value;
        this.promosSubject.next([...current, promo]);
        return promo;
      })
    );
  }

  validatePromoCode(code: string, eventId: string): Observable<PromotionalCode | null> {
    return this.promos$.pipe(
      delay(300),
      map(promos => {
        const promo = promos.find(p => 
          p.code === code && 
          p.eventId === eventId && 
          p.isActive && 
          new Date(p.expiryDate) >= new Date()
        );
        return promo || null;
      })
    );
  }

  calculateDiscount(amount: number, promoCode: PromotionalCode): number {
    return amount * (promoCode.discountPercentage / 100);
  }
}
