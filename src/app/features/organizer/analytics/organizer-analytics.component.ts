// src/app/features/organizer/analytics/organizer-analytics.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
import { AnalyticsService, SalesReport, OccupancyReport } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-organizer-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="analytics-page">
      <div class="container">
        <div class="page-header">
          <h1>Event Analytics</h1>
          <p>Track your event performance and insights</p>
        </div>

        <div class="filters-section">
          <div class="filter-group">
            <label>Select Event</label>
            <select [(ngModel)]="selectedEventId" (ngModelChange)="loadAnalytics()">
              <option value="">All Events</option>
              @for (event of myEvents; track event.id) {
                <option [value]="event.id">{{ event.name }}</option>
              }
            </select>
          </div>
          <div class="filter-group">
            <label>Period</label>
            <select [(ngModel)]="selectedPeriod" (ngModelChange)="loadAnalytics()">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <button (click)="exportReport()" class="btn btn-primary">
            📥 Export
          </button>
        </div>

        @if (loading) {
          <div class="loading">Loading analytics...</div>
        } @else {
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon">🎫</div>
              <div class="metric-content">
                <h3>{{ getTotalTicketsSold() }}</h3>
                <p>Tickets Sold</p>
                <span class="metric-change positive">+12%</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">💰</div>
              <div class="metric-content">
                <h3>RM {{ getTotalRevenue() }}</h3>
                <p>Revenue</p>
                <span class="metric-change positive">+8%</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">📊</div>
              <div class="metric-content">
                <h3>{{ getAverageOccupancy() }}%</h3>
                <p>Avg Occupancy</p>
                <span class="metric-change negative">-3%</span>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-icon">💵</div>
              <div class="metric-content">
                <h3>RM {{ getAverageTicketPrice() }}</h3>
                <p>Avg Ticket Price</p>
                <span class="metric-change">--</span>
              </div>
            </div>
          </div>

          <div class="charts-section">
            <div class="chart-card">
              <h3>Sales Performance</h3>
              <div class="chart-container">
                <div class="line-chart">
                  @for (report of salesReports; track report.period) {
                    <div class="chart-point">
                      <div 
                        class="point-bar"
                        [style.height.%]="(report.ticketsSold / getMaxSales()) * 100"
                      ></div>
                      <span class="point-label">{{ report.period }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="chart-card">
              <h3>Occupancy Rate</h3>
              <div class="chart-container">
                <div class="line-chart">
                  @for (report of occupancyReports; track report.period) {
                    <div class="chart-point">
                      <div 
                        class="point-bar occupancy"
                        [style.height.%]="report.occupancyRate"
                      ></div>
                      <span class="point-label">{{ report.period }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="table-card">
            <h3>Detailed Sales Report</h3>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Tickets Sold</th>
                    <th>Revenue</th>
                    <th>Avg Price</th>
                    <th>Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  @for (report of salesReports; track report.period) {
                    <tr>
                      <td><strong>{{ report.period }}</strong></td>
                      <td>{{ report.ticketsSold }}</td>
                      <td>RM {{ report.revenue.toLocaleString() }}</td>
                      <td>RM {{ report.averageTicketPrice }}</td>
                      <td>
                        <div class="occupancy-bar">
                          <div 
                            class="occupancy-fill"
                            [style.width.%]="getOccupancyForPeriod(report.period)"
                          ></div>
                          <span>{{ getOccupancyForPeriod(report.period) }}%</span>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .analytics-page {
      min-height: 100vh;
      background: #f9fafb;
      padding: 2rem;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .page-header p {
      color: #666;
      margin: 0;
    }

    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      display: flex;
      gap: 1.5rem;
      align-items: flex-end;
    }

    .filter-group {
      flex: 1;
    }

    .filter-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover {
      background: #4f46e5;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      gap: 1.5rem;
    }

    .metric-icon {
      font-size: 2.5rem;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 1rem;
      flex-shrink: 0;
    }

    .metric-content h3 {
      font-size: 1.75rem;
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .metric-content p {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .metric-change {
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }

    .metric-change.positive {
      background: #d1fae5;
      color: #065f46;
    }

    .metric-change.negative {
      background: #fee2e2;
      color: #dc2626;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .chart-card,
    .table-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .chart-card h3,
    .table-card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .chart-container {
      height: 250px;
    }

    .line-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 100%;
      gap: 1rem;
    }

    .chart-point {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
    }

    .point-bar {
      width: 100%;
      max-width: 50px;
      background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 0.5rem 0.5rem 0 0;
      transition: all 0.3s;
    }

    .point-bar.occupancy {
      background: linear-gradient(180deg, #10b981 0%, #059669 100%);
    }

    .point-bar:hover {
      opacity: 0.8;
    }

    .point-label {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #666;
      font-weight: 600;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
      color: #333;
    }

    tr:hover {
      background: #f9fafb;
    }

    .occupancy-bar {
      position: relative;
      width: 100px;
      height: 24px;
      background: #e5e7eb;
      border-radius: 1rem;
      overflow: hidden;
    }

    .occupancy-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      transition: width 0.3s;
    }

    .occupancy-bar span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.75rem;
      font-weight: 700;
      color: #333;
    }

    .loading {
      text-align: center;
      padding: 5rem 2rem;
      color: #666;
    }

    @media (max-width: 768px) {
      .filters-section {
        flex-direction: column;
        align-items: stretch;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OrganizerAnalyticsComponent implements OnInit {
  myEvents: any[] = [];
  selectedEventId = '';
  selectedPeriod: 'daily' | 'weekly' | 'monthly' = 'daily';
  salesReports: SalesReport[] = [];
  occupancyReports: OccupancyReport[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.eventService.getEventsByOrganizer(user.id).subscribe({
        next: (events) => {
          this.myEvents = events;
          if (events.length > 0) {
            this.selectedEventId = events[0].id;
            this.loadAnalytics();
          }
        }
      });
    }
  }

  loadAnalytics(): void {
    if (!this.selectedEventId) return;

    this.loading = true;
    
    this.analyticsService.getSalesReport(this.selectedEventId, this.selectedPeriod).subscribe({
      next: (data) => {
        this.salesReports = data;
      }
    });

    this.analyticsService.getOccupancyReport(this.selectedEventId, this.selectedPeriod).subscribe({
      next: (data) => {
        this.occupancyReports = data;
        this.loading = false;
      }
    });
  }

  getTotalTicketsSold(): number {
    return this.salesReports.reduce((sum, r) => sum + r.ticketsSold, 0);
  }

  getTotalRevenue(): string {
    return this.salesReports.reduce((sum, r) => sum + r.revenue, 0).toLocaleString();
  }

  getAverageOccupancy(): string {
    const avg = this.occupancyReports.reduce((sum, r) => sum + r.occupancyRate, 0) / this.occupancyReports.length;
    return avg.toFixed(1);
  }

  getAverageTicketPrice(): string {
    const total = this.salesReports.reduce((sum, r) => sum + r.averageTicketPrice, 0);
    return (total / this.salesReports.length).toFixed(2);
  }

  getMaxSales(): number {
    return Math.max(...this.salesReports.map(r => r.ticketsSold));
  }

  getOccupancyForPeriod(period: string): number {
    const report = this.occupancyReports.find(r => r.period === period);
    return report ? report.occupancyRate : 0;
  }

  exportReport(): void {
    this.analyticsService.exportReport(this.salesReports, 'pdf').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-analytics-${Date.now()}.pdf`;
        a.click();
      }
    });
  }
}
