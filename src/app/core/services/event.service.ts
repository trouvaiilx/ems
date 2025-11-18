// src/app/core/services/event.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Event, EventStatus, CreateEventRequest } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();

  private mockEvents: Event[] = [
    {
      id: '1',
      name: 'Annual Tech Conference 2025',
      description: 'Join us for the biggest tech conference of the year featuring keynote speakers from leading tech companies.',
      date: new Date('2025-12-15'),
      time: '09:00 AM',
      posterUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      organizerId: '2',
      organizerName: 'Event Co.',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: EventStatus.PUBLISHED
    },
    {
      id: '2',
      name: 'Classical Music Evening',
      description: 'An enchanting evening of classical music performed by renowned orchestra.',
      date: new Date('2025-12-25'),
      time: '07:30 PM',
      posterUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800',
      organizerId: '2',
      organizerName: 'Event Co.',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: EventStatus.PUBLISHED
    }
  ];

  constructor() {
    this.eventsSubject.next(this.mockEvents);
  }

  getAllEvents(): Observable<Event[]> {
    return this.events$.pipe(delay(300));
  }

  getEventById(id: string): Observable<Event | undefined> {
    return this.events$.pipe(
      delay(300),
      map(events => events.find(e => e.id === id))
    );
  }

  getEventsByOrganizer(organizerId: string): Observable<Event[]> {
    return this.events$.pipe(
      delay(300),
      map(events => events.filter(e => e.organizerId === organizerId))
    );
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.events$.pipe(
      delay(300),
      map(events => events.filter(e => 
        e.status === EventStatus.PUBLISHED && 
        new Date(e.date) >= new Date()
      ))
    );
  }

  createEvent(request: CreateEventRequest, organizerId: string, organizerName: string): Observable<Event> {
    const newEvent: Event = {
      id: Date.now().toString(),
      ...request,
      organizerId,
      organizerName,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: EventStatus.DRAFT
    };

    return of(newEvent).pipe(
      delay(500),
      map(event => {
        const currentEvents = this.eventsSubject.value;
        this.eventsSubject.next([...currentEvents, event]);
        return event;
      })
    );
  }

  updateEvent(id: string, updates: Partial<Event>): Observable<Event> {
    return of(updates).pipe(
      delay(500),
      map(() => {
        const currentEvents = this.eventsSubject.value;
        const index = currentEvents.findIndex(e => e.id === id);
        if (index !== -1) {
          currentEvents[index] = {
            ...currentEvents[index],
            ...updates,
            updatedAt: new Date()
          };
          this.eventsSubject.next([...currentEvents]);
          return currentEvents[index];
        }
        throw new Error('Event not found');
      })
    );
  }

  publishEvent(id: string): Observable<Event> {
    return this.updateEvent(id, { status: EventStatus.PUBLISHED });
  }

  cancelEvent(id: string): Observable<Event> {
    return this.updateEvent(id, { status: EventStatus.CANCELLED });
  }

  isDateAvailable(date: Date, excludeEventId?: string): Observable<boolean> {
    return this.events$.pipe(
      delay(300),
      map(events => {
        const dateStr = date.toISOString().split('T')[0];
        return !events.some(e => 
          e.id !== excludeEventId &&
          e.date.toISOString().split('T')[0] === dateStr &&
          e.status !== EventStatus.CANCELLED
        );
      })
    );
  }
}
