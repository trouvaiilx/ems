import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface OrganizerStats {
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  recentSales: any[];
  thisMonth: {
    events: number;
    bookings: number;
    revenue: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class OrganizerService {
  private apiUrl = `${environment.apiUrl}/organizer`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getStats(): Observable<OrganizerStats> {
    return this.http.get<OrganizerStats>(`${this.apiUrl}/stats`, {
      headers: this.getAuthHeaders(),
    });
  }
}
