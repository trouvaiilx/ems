// src/app/features/admin/analytics/admin-analytics.component.ts

import { Component, OnInit } from '@angular/core';
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
          <button (click)="exportReport()" class="btn btn-primary">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Export Report
          </button>
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

  constructor(private analyticsService: AnalyticsService) {}

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

  exportReport(): void {
    this.analyticsService.exportReport(this.reports, 'pdf').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auditorium-report-${Date.now()}.pdf`;
        a.click();
      },
    });
  }
}
