// src/app/core/services/event.service.ts - BACKEND INTEGRATED

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Event, EventStatus, CreateEventRequest } from '../models/event.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private mapEventFromResponse(data: any): Event {
    return {
      id: data._id,
      name: data.name,
      description: data.description,
      date: new Date(data.date),
      time: data.time,
      posterUrl: data.posterUrl,
      organizerId: data.organizerId,
      organizerName: data.organizerName,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      status: data.status as EventStatus,
    };
  }

  getAllEvents(filters?: {
    keyword?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<Event[]> {
    let params: any = {};
    if (filters) {
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
    }

    return this.http.get<any[]>(this.apiUrl, { params }).pipe(
      map((events) => events.map((e) => this.mapEventFromResponse(e))),
      catchError((error) => {
        console.error('Get events error:', error);
        return throwError(() => new Error('Failed to fetch events'));
      })
    );
  }

  getEventById(id: string): Observable<Event | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((event) => this.mapEventFromResponse(event)),
      catchError((error) => {
        console.error('Get event error:', error);
        return throwError(() => new Error('Failed to fetch event'));
      })
    );
  }

  getEventsByOrganizer(organizerId: string): Observable<Event[]> {
    return this.getAllEvents().pipe(
      map((events) => events.filter((e) => e.organizerId === organizerId))
    );
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.getAllEvents().pipe(
      map((events) =>
        events.filter((e) => e.status === EventStatus.PUBLISHED && new Date(e.date) >= new Date())
      )
    );
  }

  createEvent(
    request: CreateEventRequest | FormData,
    organizerId: string,
    organizerName: string
  ): Observable<Event> {
    let payload: any;
    let headers = this.getAuthHeaders();

    if (request instanceof FormData) {
      payload = request;
      payload.append('organizerName', organizerName);
      // Remove Content-Type to let browser set boundary
      headers = headers.delete('Content-Type');
    } else {
      payload = {
        name: request.name,
        description: request.description,
        date: request.date.toISOString(),
        time: request.time,
        posterUrl: request.posterUrl || '',
        organizerName: organizerName,
      };
    }

    return this.http
      .post<any>(this.apiUrl, payload, {
        headers,
      })
      .pipe(
        map((event) => this.mapEventFromResponse(event)),
        catchError((error) => {
          console.error('Create event error:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to create event'));
        })
      );
  }

  updateEvent(id: string, updates: Partial<Event> | FormData): Observable<Event> {
    let payload: any;
    let headers = this.getAuthHeaders();

    if (updates instanceof FormData) {
      payload = updates;
      headers = headers.delete('Content-Type');
    } else {
      payload = {};
      if (updates.name) payload.name = updates.name;
      if (updates.description) payload.description = updates.description;
      if (updates.date) payload.date = new Date(updates.date).toISOString();
      if (updates.time) payload.time = updates.time;
      if (updates.posterUrl !== undefined) payload.posterUrl = updates.posterUrl;
      if (updates.status) payload.status = updates.status;
    }

    return this.http
      .put<any>(`${this.apiUrl}/${id}`, payload, {
        headers,
      })
      .pipe(
        map((event) => this.mapEventFromResponse(event)),
        catchError((error) => {
          console.error('Update event error:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to update event'));
        })
      );
  }

  publishEvent(id: string): Observable<Event> {
    return this.updateEvent(id, { status: EventStatus.PUBLISHED });
  }

  cancelEvent(id: string): Observable<Event> {
    return this.updateEvent(id, { status: EventStatus.CANCELLED });
  }

  deleteEvent(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Delete event error:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to delete event'));
        })
      );
  }

  isDateAvailable(date: Date, excludeEventId?: string): Observable<boolean> {
    return this.getAllEvents().pipe(
      map((events) => {
        const dateStr = date.toISOString().split('T')[0];
        return !events.some(
          (e) =>
            e.id !== excludeEventId &&
            new Date(e.date).toISOString().split('T')[0] === dateStr &&
            e.status !== EventStatus.CANCELLED
        );
      })
    );
  }
}
