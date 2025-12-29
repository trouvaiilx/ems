// src/app/features/organizer/analytics/organizer-analytics.component.ts

import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { EventService } from '../../../core/services/event.service';
import {
  AnalyticsService,
  SalesReport,
  OccupancyReport,
} from '../../../core/services/analytics.service';

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

          <div class="export-dropdown" #dropdownRef>
            <button
              class="btn btn-primary dropdown-trigger"
              (click)="showExportMenu = !showExportMenu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Report
              <svg
                class="chevron"
                [class.rotated]="showExportMenu"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            @if (showExportMenu) {
            <div class="dropdown-menu">
              <button (click)="exportReport('csv')" class="dropdown-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export as CSV
              </button>
              <button (click)="exportReport('pdf')" class="dropdown-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Export as PDF
              </button>
            </div>
            }
          </div>
        </div>

        @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading analytics...</p>
        </div>
        } @else {
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <div class="metric-content">
              <h3>{{ getTotalTicketsSold() }}</h3>
              <p>Tickets Sold</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="metric-content">
              <h3>RM {{ getTotalRevenue() }}</h3>
              <p>Revenue</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div class="metric-content">
              <h3>{{ getAverageOccupancy() }}%</h3>
              <p>Avg Occupancy</p>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
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
                  <div class="bar-wrapper">
                    <div
                      class="point-bar"
                      [style.height.%]="(report.ticketsSold / getMaxSales()) * 100"
                    >
                      <span class="bar-value">{{ report.ticketsSold }}</span>
                    </div>
                  </div>
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
                  <div class="bar-wrapper">
                    <div class="point-bar occupancy" [style.height.%]="report.occupancyRate">
                      <span class="bar-value">{{ report.occupancyRate }}%</span>
                    </div>
                  </div>
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
                  <td>
                    <strong>{{ report.period }}</strong>
                  </td>
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
  styles: [
    `
      .analytics-page {
        min-height: 100vh;
        background: var(--primary-100);
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
        color: var(--primary-900);
      }

      .page-header p {
        color: var(--primary-600);
        margin: 0;
        font-size: 1.125rem;
      }

      .filters-section {
        background: var(--neutral-white);
        padding: 1.5rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        margin-bottom: 2rem;
        display: flex;
        gap: 1.5rem;
        align-items: flex-end;
        flex-wrap: wrap;
      }

      .filter-group {
        flex: 1;
        min-width: 200px;
      }

      .filter-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--primary-900);
        font-size: 0.875rem;
      }

      select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all var(--transition-fast);
      }

      select:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      /* Dropdown Styles */
      .export-dropdown {
        position: relative;
      }

      .dropdown-trigger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 160px;
        justify-content: space-between;
      }

      .chevron {
        width: 1.25rem;
        height: 1.25rem;
        transition: transform var(--transition-base);
      }

      .chevron.rotated {
        transform: rotate(180deg);
      }

      .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        background: var(--neutral-white);
        border: 1px solid var(--primary-200);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        min-width: 200px;
        z-index: 50;
        padding: 0.5rem;
        animation: slideDown 0.2s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem 1rem;
        border: none;
        background: none;
        color: var(--primary-700);
        font-weight: 500;
        font-size: 0.875rem;
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
        text-align: left;
      }

      .dropdown-item:hover {
        background: var(--primary-50);
        color: var(--accent-600);
      }

      .dropdown-item svg {
        width: 1.25rem;
        height: 1.25rem;
        color: var(--primary-400);
      }

      .dropdown-item:hover svg {
        color: var(--accent-600);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
        font-size: 0.9375rem;
      }

      .btn svg {
        width: 1.125rem;
        height: 1.125rem;
      }

      .btn-primary {
        background: var(--accent-600);
        color: var(--neutral-white);
      }

      .btn-primary:hover {
        background: var(--accent-700);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .metric-card {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        display: flex;
        gap: 1.5rem;
        border: 1px solid var(--primary-200);
        transition: all var(--transition-base);
      }

      .metric-card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
      }

      .metric-icon {
        width: 3.5rem;
        height: 3.5rem;
        background: var(--accent-300);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .metric-icon svg {
        width: 2rem;
        height: 2rem;
        color: var(--accent-800);
        stroke-width: 2;
      }

      .metric-content h3 {
        font-size: 1.75rem;
        margin: 0 0 0.25rem 0;
        color: var(--primary-900);
        line-height: 1;
      }

      .metric-content p {
        margin: 0 0 0.5rem 0;
        color: var(--primary-600);
        font-size: 0.875rem;
        font-weight: 500;
      }

      .metric-change {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8125rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
      }

      .metric-change svg {
        width: 0.875rem;
        height: 0.875rem;
      }

      .metric-change.positive {
        background: var(--success-100);
        color: var(--success-700);
      }

      .metric-change.negative {
        background: var(--error-100);
        color: var(--error-700);
      }

      .charts-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .chart-card,
      .table-card {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
      }

      .chart-card h3,
      .table-card h3 {
        margin: 0 0 1.5rem 0;
        color: var(--primary-900);
        font-size: 1.25rem;
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
        padding-bottom: 2rem;
      }

      .chart-point {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .bar-wrapper {
        height: 180px;
        display: flex;
        align-items: flex-end;
        width: 100%;
        justify-content: center;
      }

      .chart-point-wrapper {
        height: 250px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 100%;
      }

      .point-bar {
        width: 50px;
        min-height: 30px;
        background: linear-gradient(180deg, var(--accent-600) 0%, var(--accent-800) 100%);
        border-radius: var(--radius-md) var(--radius-md) 0 0;
        transition: all var(--transition-base);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 0.5rem;
      }

      .bar-value {
        color: var(--neutral-white);
        font-weight: 700;
        font-size: 0.875rem;
      }

      .point-bar.occupancy {
        background: linear-gradient(180deg, var(--success-600) 0%, var(--success-700) 100%);
      }

      .point-bar:hover {
        opacity: 0.8;
        transform: translateY(-2px);
      }

      .point-label {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: var(--primary-600);
        font-weight: 600;
      }

      .table-wrapper {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }

      th,
      td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--primary-200);
      }

      th {
        background: var(--primary-100);
        font-weight: 600;
        color: var(--primary-900);
      }

      tr:hover {
        background: var(--primary-100);
      }

      .occupancy-bar {
        position: relative;
        width: 100px;
        height: 24px;
        background: var(--primary-200);
        border-radius: var(--radius-md);
        overflow: hidden;
      }

      .occupancy-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--success-600) 0%, var(--success-700) 100%);
        transition: width var(--transition-base);
      }

      .occupancy-bar span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--primary-900);
      }

      .loading-state {
        text-align: center;
        padding: 5rem 2rem;
      }

      .spinner {
        width: 60px;
        height: 60px;
        border: 4px solid var(--primary-300);
        border-top: 4px solid var(--accent-600);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading-state p {
        color: var(--primary-600);
        font-size: 0.9375rem;
      }

      @media (max-width: 768px) {
        .analytics-page {
          padding: 1rem;
        }

        .filters-section {
          flex-direction: column;
          align-items: stretch;
        }

        .charts-section {
          grid-template-columns: 1fr;
        }

        .metrics-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class OrganizerAnalyticsComponent implements OnInit {
  myEvents: any[] = [];
  selectedEventId = '';
  salesReports: SalesReport[] = [];
  occupancyReports: OccupancyReport[] = [];
  loading = true;
  showExportMenu = false;

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

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
        },
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (
      this.showExportMenu &&
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target)
    ) {
      this.showExportMenu = false;
    }
  }

  loadAnalytics(): void {
    if (!this.selectedEventId) return;

    this.loading = true;

    // Defaulting to monthly for internal graph data if backend asks
    this.analyticsService.getSalesReport(this.selectedEventId, 'monthly').subscribe({
      next: (data) => {
        this.salesReports = data;
      },
    });

    this.analyticsService.getOccupancyReport(this.selectedEventId, 'monthly').subscribe({
      next: (data) => {
        this.occupancyReports = data;
        this.loading = false;
      },
    });
  }
  // ... getters stay ...

  // Need to fix where the previous replace ended to match context properly or I can replace the whole class.
  // replacing up to exportReport

  getTotalTicketsSold(): number {
    return this.salesReports.reduce((sum, r) => sum + r.ticketsSold, 0);
  }

  getTotalRevenue(): string {
    return this.salesReports.reduce((sum, r) => sum + r.revenue, 0).toLocaleString();
  }

  getAverageOccupancy(): string {
    const avg =
      this.occupancyReports.reduce((sum, r) => sum + r.occupancyRate, 0) /
      this.occupancyReports.length;
    return avg.toFixed(1);
  }

  getAverageTicketPrice(): string {
    const total = this.salesReports.reduce((sum, r) => sum + r.averageTicketPrice, 0);
    return (total / this.salesReports.length).toFixed(2);
  }

  getMaxSales(): number {
    return Math.max(...this.salesReports.map((r) => r.ticketsSold));
  }

  getOccupancyForPeriod(period: string): number {
    const report = this.occupancyReports.find((r) => r.period === period);
    return report ? report.occupancyRate : 0;
  }

  exportReport(format: 'pdf' | 'csv'): void {
    this.showExportMenu = false;
    this.analyticsService.exportReport(format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-analytics-${Date.now()}.${format}`;
        a.click();
      },
    });
  }
}
