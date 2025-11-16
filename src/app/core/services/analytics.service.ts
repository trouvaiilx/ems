// src/app/core/services/analytics.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  providedIn: 'root'
})
export class AnalyticsService {
  
  getSalesReport(eventId: string, period: 'daily' | 'weekly' | 'monthly'): Observable<SalesReport[]> {
    // Mock data - would fetch from backend
    const mockData: SalesReport[] = [
      { period: '2025-11-10', ticketsSold: 45, revenue: 6750, averageTicketPrice: 150 },
      { period: '2025-11-11', ticketsSold: 38, revenue: 5700, averageTicketPrice: 150 },
      { period: '2025-11-12', ticketsSold: 52, revenue: 7800, averageTicketPrice: 150 }
    ];

    return of(mockData).pipe(delay(500));
  }

  getOccupancyReport(eventId: string, period: 'daily' | 'weekly' | 'monthly'): Observable<OccupancyReport[]> {
    const mockData: OccupancyReport[] = [
      { period: '2025-11-10', totalSeats: 500, occupiedSeats: 425, occupancyRate: 85 },
      { period: '2025-11-11', totalSeats: 500, occupiedSeats: 463, occupancyRate: 92.6 },
      { period: '2025-11-12', totalSeats: 500, occupiedSeats: 489, occupancyRate: 97.8 }
    ];

    return of(mockData).pipe(delay(500));
  }

  getAuditoriumUsageReport(period: 'weekly' | 'monthly'): Observable<AuditoriumUsageReport[]> {
    const mockData: AuditoriumUsageReport[] = [
      { period: 'Week 1', eventsHosted: 3, totalRevenue: 45000, averageOccupancy: 87.5 },
      { period: 'Week 2', eventsHosted: 4, totalRevenue: 62000, averageOccupancy: 91.2 },
      { period: 'Week 3', eventsHosted: 2, totalRevenue: 28000, averageOccupancy: 78.3 }
    ];

    return of(mockData).pipe(delay(500));
  }

  exportReport(data: any[], format: 'pdf' | 'csv'): Observable<Blob> {
    // Mock export - would generate actual file
    const mockBlob = new Blob(['Mock report data'], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
    return of(mockBlob).pipe(delay(1000));
  }
}
