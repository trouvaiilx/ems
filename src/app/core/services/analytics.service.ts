// src/app/core/services/analytics.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface SalesReport {
  period: string;
  ticketsSold: number;
  revenue: number;
  averageTicketPrice: number;
}

export interface OccupancyReport {
  period: string;
  totalSeats: number;
  occupiedSeats: number;
  occupancyRate: number;
}

export interface AuditoriumUsageReport {
  period: string;
  eventsHosted: number;
  totalRevenue: number;
  averageOccupancy: number;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private organizerUrl = `${environment.apiUrl}/organizer/analytics`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders() {
    return {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` },
    };
  }

  getSalesReport(
    eventId: string,
    period: 'daily' | 'weekly' | 'monthly'
  ): Observable<SalesReport[]> {
    return this.http
      .get<any>(this.organizerUrl, {
        ...this.getAuthHeaders(),
        params: { eventId, period },
      })
      .pipe(map((res) => res.salesReports));
  }

  getOccupancyReport(
    eventId: string,
    period: 'daily' | 'weekly' | 'monthly'
  ): Observable<OccupancyReport[]> {
    return this.http
      .get<any>(this.organizerUrl, {
        ...this.getAuthHeaders(),
        params: { eventId, period },
      })
      .pipe(map((res) => res.occupancyReports));
  }

  getAuditoriumUsageReport(period: 'weekly' | 'monthly'): Observable<AuditoriumUsageReport[]> {
    return this.http.get<AuditoriumUsageReport[]>(`${environment.apiUrl}/admin/analytics`, {
      params: { period },
    });
  }

  exportReport(format: 'pdf' | 'csv'): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/organizer/export`, {
      ...this.getAuthHeaders(),
      params: { format },
      responseType: 'blob',
    });
  }

  exportAdminReport(period: 'weekly' | 'monthly', format: 'pdf' | 'csv'): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/admin/export`, {
      params: { period, format },
      responseType: 'blob',
    });
  }
}
