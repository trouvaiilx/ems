// src/app/features/organizer/ticket-setup/ticket-setup.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { TicketCategory, SeatingSection } from '../../../core/models/ticket.model';

interface TicketTypeForm {
  category: TicketCategory;
  section: SeatingSection;
  price: number;
  maxTickets: number;
}

@Component({
  selector: 'app-ticket-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ticket-setup-page">
      <div class="container">
        @if (event) {
          <div class="page-header">
            <h1>Ticket Setup</h1>
            <p>Configure tickets for {{ event.name }}</p>
          </div>

          <div class="setup-grid">
            <div class="main-content">
              <div class="card">
                <h3>Add Ticket Types</h3>
                
                <div class="form-row">
                  <div class="form-group">
                    <label>Category</label>
                    <select [(ngModel)]="newTicket.category">
                      <option [value]="TicketCategory.GENERAL_ADMISSION">General Admission</option>
                      <option [value]="TicketCategory.VIP">VIP</option>
                      <option [value]="TicketCategory.SENIOR_CITIZEN">Senior Citizen</option>
                      <option [value]="TicketCategory.CHILD">Child</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>Section</label>
                    <select [(ngModel)]="newTicket.section">
                      <option [value]="SeatingSection.BALCONY">Balcony</option>
                      <option [value]="SeatingSection.MEZZANINE">Mezzanine</option>
                      <option [value]="SeatingSection.STALL">Stall</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Price (RM)</label>
                    <input type="number" [(ngModel)]="newTicket.price" min="0" step="10" />
                  </div>

                  <div class="form-group">
                    <label>Max Tickets</label>
                    <input type="number" [(ngModel)]="newTicket.maxTickets" min="1" max="500" />
                  </div>
                </div>

                <button (click)="addTicketType()" class="btn btn-primary">
                  Add Ticket Type
                </button>
              </div>

              @if (ticketTypes.length > 0) {
                <div class="card">
                  <h3>Configured Tickets</h3>
                  <div class="ticket-list">
                    @for (ticket of ticketTypes; track $index) {
                      <div class="ticket-item">
                        <div class="ticket-info">
                          <h4>{{ getCategoryName(ticket.category) }}</h4>
                          <p>{{ ticket.section }} • RM {{ ticket.price }}</p>
                          <p class="capacity">Max: {{ ticket.maxTickets }} tickets</p>
                        </div>
                        <button (click)="removeTicketType($index)" class="btn-remove">
                          ✕
                        </button>
                      </div>
                    }
                  </div>
                </div>

                <div class="card">
                  <h3>Promotional Code (Optional)</h3>
                  <div class="form-group">
                    <label>Code</label>
                    <input type="text" [(ngModel)]="promoCode" placeholder="PROMO2025" />
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Discount (%)</label>
                      <input type="number" [(ngModel)]="promoDiscount" min="0" max="100" />
                    </div>
                    <div class="form-group">
                      <label>Expiry Date</label>
                      <input type="date" [(ngModel)]="promoExpiry" />
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="sidebar">
              <div class="summary-card">
                <h3>Setup Summary</h3>
                <div class="summary-stats">
                  <div class="stat">
                    <span class="stat-label">Ticket Types</span>
                    <span class="stat-value">{{ ticketTypes.length }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Total Capacity</span>
                    <span class="stat-value">{{ getTotalCapacity() }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Price Range</span>
                    <span class="stat-value">{{ getPriceRange() }}</span>
                  </div>
                </div>

                @if (ticketTypes.length > 0) {
                  <button 
                    (click)="saveConfiguration()" 
                    class="btn btn-primary btn-block"
                    [disabled]="saving"
                  >
                    {{ saving ? 'Saving...' : 'Save & Publish Event' }}
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .ticket-setup-page {
      min-height: 100vh;
      background: #f9fafb;
      padding: 2rem;
    }

    .container {
      max-width: 1200px;
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

    .setup-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    @media (max-width: 968px) {
      .setup-grid {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
      font-size: 0.875rem;
    }

    input,
    select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: #6366f1;
    }

    .ticket-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .ticket-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .ticket-info h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .ticket-info p {
      margin: 0 0 0.25rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .capacity {
      color: #6366f1;
      font-weight: 600;
    }

    .btn-remove {
      width: 36px;
      height: 36px;
      border: 2px solid #dc2626;
      background: white;
      color: #dc2626;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1.25rem;
    }

    .btn-remove:hover {
      background: #dc2626;
      color: white;
    }

    .summary-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: sticky;
      top: 2rem;
    }

    .summary-card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .summary-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.875rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #6366f1;
    }

    .btn {
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-block {
      width: 100%;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4f46e5;
      transform: translateY(-2px);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class TicketSetupComponent implements OnInit {
  event: Event | undefined;
  TicketCategory = TicketCategory;
  SeatingSection = SeatingSection;

  newTicket: TicketTypeForm = {
    category: TicketCategory.GENERAL_ADMISSION,
    section: SeatingSection.STALL,
    price: 100,
    maxTickets: 100
  };

  ticketTypes: TicketTypeForm[] = [];
  promoCode = '';
  promoDiscount = 0;
  promoExpiry = '';
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe({
        next: (event) => {
          this.event = event;
        }
      });
    }
  }

  addTicketType(): void {
    this.ticketTypes.push({ ...this.newTicket });
  }

  removeTicketType(index: number): void {
    this.ticketTypes.splice(index, 1);
  }

  getCategoryName(category: TicketCategory): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getTotalCapacity(): number {
    return this.ticketTypes.reduce((sum, t) => sum + t.maxTickets, 0);
  }

  getPriceRange(): string {
    if (this.ticketTypes.length === 0) return 'N/A';
    const prices = this.ticketTypes.map(t => t.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `RM ${min}` : `RM ${min} - ${max}`;
  }

  saveConfiguration(): void {
    if (!this.event) return;

    this.saving = true;

    this.ticketService.createTicketTypes(this.event.id, this.ticketTypes).subscribe({
      next: () => {
        if (this.promoCode && this.promoDiscount > 0) {
          this.ticketService.createPromoCode({
            eventId: this.event!.id,
            code: this.promoCode,
            discountPercentage: this.promoDiscount,
            applicableCategories: this.ticketTypes.map(t => t.category),
            expiryDate: new Date(this.promoExpiry),
            isActive: true
          }).subscribe();
        }

        this.eventService.publishEvent(this.event!.id).subscribe({
          next: () => {
            this.router.navigate(['/organizer/dashboard']);
          }
        });
      }
    });
  }
}
