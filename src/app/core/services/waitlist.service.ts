// src/app/core/services/waitlist.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Waitlist } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class WaitlistService {
  private waitlistSubject = new BehaviorSubject<Waitlist[]>([]);
  public waitlist$ = this.waitlistSubject.asObservable();

  private readonly MAX_WAITLIST_SIZE = 100;

  joinWaitlist(eventId: string, attendeeId: string, email: string, phone: string): Observable<Waitlist> {
    return this.waitlist$.pipe(
      delay(500),
      map(waitlist => {
        const eventWaitlist = waitlist.filter(w => w.eventId === eventId);
        
        if (eventWaitlist.length >= this.MAX_WAITLIST_SIZE) {
          throw new Error('Waitlist is full');
        }

        if (eventWaitlist.some(w => w.attendeeId === attendeeId)) {
          throw new Error('Already on waitlist');
        }

        const newEntry: Waitlist = {
          id: Date.now().toString(),
          eventId,
          attendeeId,
          attendeeEmail: email,
          attendeePhone: phone,
          joinedAt: new Date(),
          notified: false
        };

        this.waitlistSubject.next([...waitlist, newEntry]);
        return newEntry;
      })
    );
  }

  leaveWaitlist(waitlistId: string): Observable<boolean> {
    return of(waitlistId).pipe(
      delay(300),
      map(id => {
        const current = this.waitlistSubject.value;
        const filtered = current.filter(w => w.id !== id);
        this.waitlistSubject.next(filtered);
        return true;
      })
    );
  }

  getWaitlistByEvent(eventId: string): Observable<Waitlist[]> {
    return this.waitlist$.pipe(
      delay(300),
      map(waitlist => waitlist.filter(w => w.eventId === eventId))
    );
  }

  notifyNextInLine(eventId: string): Observable<Waitlist | null> {
    return this.waitlist$.pipe(
      delay(500),
      map(waitlist => {
        const eventWaitlist = waitlist
          .filter(w => w.eventId === eventId && !w.notified)
          .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime());

        if (eventWaitlist.length > 0) {
          const next = eventWaitlist[0];
          next.notified = true;
          this.waitlistSubject.next([...waitlist]);
          return next;
        }
        return null;
      })
    );
  }
}
