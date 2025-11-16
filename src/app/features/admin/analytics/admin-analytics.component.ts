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
            📥 Export Report
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
              <div class="stat-icon">🎭</div>
              <div class="stat-content">
                <h3>{{ getTotalEvents() }}</h3>
                <p>Events Hosted</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <h3>RM {{ getTotalRevenue() }}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <h3>{{ getAverageOccupancy() }}%</h3>
                <p>Avg Occupancy</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📈</div>
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
                      <td><strong>{{ report.period }}</strong></td>
                      <td>{{ report.eventsHosted }}</td>
                      <td>RM {{ report.totalRevenue.toLocaleString() }}</td>
                      <td>
                        <div class="progress-bar">
                          <div 
                            class="progress-fill"
                            [style.width.%]="report.averageOccupancy"
                          ></div>
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

    .filters-card {
      background: white;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .filter-group label {
      font-weight: 600;
      color: #333;
    }

    select {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      min-width: 150px;
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

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 1rem;
    }

    .stat-content h3 {
      font-size: 1.75rem;
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .chart-card,
    .data-table-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .chart-card h2,
    .data-table-card h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
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
      height: 250px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .bar {
      width: 60px;
      background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 0.5rem 0.5rem 0 0;
      position: relative;
      transition: all 0.3s;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 0.5rem;
    }

    .bar:hover {
      opacity: 0.8;
    }

    .bar-label {
      color: white;
      font-weight: 700;
      font-size: 0.875rem;
    }

    .bar-period {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #666;
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
    }

    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 0.25rem;
    }

    .legend-color.events {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    .data-table th {
      background: #f9fafb;
      font-weight: 600;
      color: #333;
    }

    .data-table tr:hover {
      background: #f9fafb;
    }

    .progress-bar {
      position: relative;
      width: 150px;
      height: 24px;
      background: #e5e7eb;
      border-radius: 1rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      transition: width 0.3s;
    }

    .progress-label {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.75rem;
      font-weight: 700;
      color: #333;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: #e5e7eb;
      color: #666;
    }

    .status-badge.high {
      background: #d1fae5;
      color: #065f46;
    }

    .loading-container {
      text-align: center;
      padding: 5rem 2rem;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
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
      }
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
    return Math.round(this.reports.reduce((sum, r) => sum + r.averageOccupancy, 0) / this.reports.length);
  }

  getMaxEvents(): number {
    return Math.max(...this.reports.map(r => r.eventsHosted));
  }

  exportReport(): void {
    this.analyticsService.exportReport(this.reports, 'pdf').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auditorium-report-${Date.now()}.pdf`;
        a.click();
      }
    });
  }
}
