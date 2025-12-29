// src/app/features/admin/analytics/admin-analytics.component.ts

import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService, AuditoriumUsageReport } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="analytics-page">
      <div class="container">
        <div class="page-header">
          <h1>Auditorium Analytics</h1>
          <p>View comprehensive auditorium usage reports</p>
        </div>

        <div class="filters-card">
          <div class="filter-group">
            <label>Report Period</label>
            <select [(ngModel)]="selectedPeriod" (ngModelChange)="loadReport()">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
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
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading analytics...</p>
        </div>
        } @else {
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ getTotalEvents() }}</h3>
              <p>Events Hosted</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="stat-content">
              <h3>RM {{ getTotalRevenue() }}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ getAverageOccupancy() }}%</h3>
              <p>Avg Occupancy</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ getUtilizationRate() }}%</h3>
              <p>Utilization Rate</p>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h2>Usage Overview</h2>
          <div class="chart-container">
            <div class="bar-chart">
              @for (report of reports; track report.period) {
              <div class="bar-group">
                <div class="bar-wrapper">
                  <div
                    class="bar events"
                    [style.height.%]="(report.eventsHosted / getMaxEvents()) * 100"
                  >
                    <span class="bar-label">{{ report.eventsHosted }}</span>
                  </div>
                </div>
                <span class="bar-period">{{ report.period }}</span>
              </div>
              }
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color events"></span>
              <span>Events Hosted</span>
            </div>
          </div>
        </div>

        <div class="data-table-card">
          <h2>Detailed Report</h2>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Events Hosted</th>
                  <th>Total Revenue</th>
                  <th>Avg Occupancy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (report of reports; track report.period) {
                <tr>
                  <td>
                    <strong>{{ report.period }}</strong>
                  </td>
                  <td>{{ report.eventsHosted }}</td>
                  <td>RM {{ report.totalRevenue.toLocaleString() }}</td>
                  <td>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="report.averageOccupancy"></div>
                      <span class="progress-label">{{ report.averageOccupancy }}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" [class.high]="report.averageOccupancy > 80">
                      {{ report.averageOccupancy > 80 ? 'High' : 'Normal' }}
                    </span>
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

      .filters-card {
        background: var(--neutral-white);
        padding: 1.5rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        margin-bottom: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .filter-group {
        flex: 1;
        min-width: 200px;
      }

      .filter-group label {
        display: block;
        font-weight: 600;
        color: var(--primary-900);
        margin-bottom: 0.5rem;
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

      .btn-outline {
        border: 1px solid var(--primary-300);
        background: var(--neutral-white);
        color: var(--primary-700);
      }

      .btn-outline:hover {
        border-color: var(--primary-400);
        background: var(--primary-50);
        color: var(--primary-900);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      .btn svg {
        width: 1.25rem;
        height: 1.25rem;
      }

      .btn-primary {
        background: var(--accent-600);
        color: var(--neutral-white);
        border: 1px solid transparent;
      }

      .btn-primary:hover {
        background: var(--accent-700);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      .stats-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        border: 1px solid var(--primary-200);
        transition: all var(--transition-base);
      }

      .stat-card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
      }

      .stat-icon {
        width: 3.5rem;
        height: 3.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--accent-300);
        border-radius: var(--radius-lg);
        flex-shrink: 0;
      }

      .stat-icon svg {
        width: 2rem;
        height: 2rem;
        color: var(--accent-800);
        stroke-width: 2;
      }

      .stat-content h3 {
        font-size: 1.75rem;
        margin: 0 0 0.25rem 0;
        color: var(--primary-900);
        line-height: 1;
      }

      .stat-content p {
        margin: 0;
        color: var(--primary-600);
        font-size: 0.875rem;
        font-weight: 500;
      }

      .chart-card,
      .data-table-card {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        margin-bottom: 2rem;
        border: 1px solid var(--primary-200);
      }

      .chart-card h2,
      .data-table-card h2 {
        margin: 0 0 1.5rem 0;
        color: var(--primary-900);
        font-size: 1.25rem;
      }

      .chart-container {
        height: 300px;
        padding: 2rem 0;
      }

      .bar-chart {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        height: 100%;
        gap: 1rem;
      }

      .bar-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .bar-wrapper {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }

      .bar {
        width: 60px;
        background: linear-gradient(180deg, var(--accent-600) 0%, var(--accent-800) 100%);
        border-radius: var(--radius-md) var(--radius-md) 0 0;
        position: relative;
        transition: all var(--transition-base);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 0.5rem;
      }

      .bar:hover {
        opacity: 0.8;
        transform: translateY(-2px);
      }

      .bar-label {
        color: var(--neutral-white);
        font-weight: 700;
        font-size: 0.875rem;
      }

      .bar-period {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: var(--primary-600);
        font-weight: 600;
      }

      .chart-legend {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--primary-700);
        font-weight: 500;
      }

      .legend-color {
        width: 20px;
        height: 20px;
        border-radius: var(--radius-sm);
      }

      .legend-color.events {
        background: linear-gradient(135deg, var(--accent-600) 0%, var(--accent-800) 100%);
      }

      .table-wrapper {
        overflow-x: auto;
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }

      .data-table th,
      .data-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--primary-200);
      }

      .data-table th {
        background: var(--primary-100);
        font-weight: 600;
        color: var(--primary-900);
      }

      .data-table tr:hover {
        background: var(--primary-100);
      }

      .progress-bar {
        position: relative;
        width: 150px;
        height: 24px;
        background: var(--primary-200);
        border-radius: var(--radius-md);
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--success-600) 0%, var(--success-700) 100%);
        transition: width var(--transition-base);
      }

      .progress-label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--primary-900);
      }

      .status-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: var(--radius-md);
        font-size: 0.75rem;
        font-weight: 600;
        background: var(--primary-200);
        color: var(--primary-700);
      }

      .status-badge.high {
        background: var(--success-100);
        color: var(--success-700);
      }

      .loading-container {
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

      .loading-container p {
        color: var(--primary-600);
        font-size: 0.9375rem;
      }

      @media (max-width: 768px) {
        .analytics-page {
          padding: 1rem;
        }

        .filters-card {
          flex-direction: column;
          align-items: stretch;
        }

        .stats-overview {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminAnalyticsComponent implements OnInit {
  selectedPeriod: 'weekly' | 'monthly' = 'weekly';
  reports: AuditoriumUsageReport[] = [];
  loading = true;
  showExportMenu = false;

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  constructor(private analyticsService: AnalyticsService) {}

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

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.analyticsService.getAuditoriumUsageReport(this.selectedPeriod).subscribe({
      next: (data) => {
        this.reports = data;
        this.loading = false;
      },
    });
  }
  // ... rest of class logic ...

  getTotalEvents(): number {
    return this.reports.reduce((sum, r) => sum + r.eventsHosted, 0);
  }

  getTotalRevenue(): string {
    return this.reports.reduce((sum, r) => sum + r.totalRevenue, 0).toLocaleString();
  }

  getAverageOccupancy(): string {
    const avg = this.reports.reduce((sum, r) => sum + r.averageOccupancy, 0) / this.reports.length;
    return avg.toFixed(1);
  }

  getUtilizationRate(): number {
    return Math.round(
      this.reports.reduce((sum, r) => sum + r.averageOccupancy, 0) / this.reports.length
    );
  }

  getMaxEvents(): number {
    return Math.max(...this.reports.map((r) => r.eventsHosted));
  }

  exportReport(format: 'pdf' | 'csv' = 'pdf'): void {
    this.showExportMenu = false;
    this.analyticsService.exportAdminReport(this.selectedPeriod, format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auditorium-report-${this.selectedPeriod}-${Date.now()}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Export failed', err),
    });
  }
}
