// src/app/features/organizer/ticket-setup/ticket-setup.component.ts

import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { TicketCategory, SeatingSection } from '../../../core/models/ticket.model';
import { CanComponentDeactivate } from '../../../core/guards/pending-changes.guard';

interface TicketTypeForm {
  id?: string;
  category: TicketCategory;
  section: SeatingSection;
  price: number;
  maxTickets: number;
  waitlistAllocation?: number;

  isEditing?: boolean;
  isModified?: boolean;
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
                  <label>Max Tickets (Max: {{ getSectionCapacity(newTicket.section) }})</label>
                  <input
                    type="number"
                    [(ngModel)]="newTicket.maxTickets"
                    min="1"
                    [max]="getSectionCapacity(newTicket.section)"
                  />
                </div>
              </div>

              <!-- Seat Config Removed per global fixed layout -->

              @if (addError) {
              <div class="error-message">{{ addError }}</div>
              }

              <button (click)="addTicketType()" class="btn btn-primary">Add Ticket Type</button>
            </div>

            @if (ticketTypes.length > 0) {
            <div class="card">
              <h3>Configured Tickets</h3>
              <div class="ticket-list">
                @for (ticket of ticketTypes; track $index) {
                <div class="ticket-item" [class.editing]="ticket.isEditing">
                  @if (!ticket.isEditing) {
                  <div class="ticket-info">
                    <h4>{{ getCategoryName(ticket.category) }}</h4>
                    <p>{{ ticket.section }} • RM {{ ticket.price }}</p>

                    <div class="allocation-controls">
                      <span class="capacity-label">Max:</span>

                      <div class="control-group">
                        <button
                          class="btn-micro"
                          (click)="updateTicketAllocation(ticket, -1)"
                          [disabled]="(ticket.waitlistAllocation || 0) <= 0"
                        >
                          -
                        </button>
                        <span class="capacity-value">{{ ticket.maxTickets }}</span>
                        <button class="btn-micro" (click)="updateTicketAllocation(ticket, 1)">
                          +
                        </button>
                      </div>

                      @if (ticket.waitlistAllocation) {
                      <span class="waitlist-tag">{{ ticket.waitlistAllocation }} added</span>
                      }
                    </div>
                  </div>
                  <div class="item-actions">
                    <button (click)="toggleEdit($index)" class="btn-icon btn-edit" title="Edit">
                      ✎
                    </button>
                    <button
                      (click)="removeTicketType($index)"
                      class="btn-icon btn-remove"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                  } @else {
                  <div class="edit-form">
                    <h4>Editing {{ getCategoryName(ticket.category) }}</h4>

                    <div class="form-row">
                      <div class="form-group">
                        <label>Section</label>
                        <select [(ngModel)]="ticket.section">
                          <option [value]="SeatingSection.BALCONY">Balcony</option>
                          <option [value]="SeatingSection.MEZZANINE">Mezzanine</option>
                          <option [value]="SeatingSection.STALL">Stall</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label>Price</label>
                        <input type="number" [(ngModel)]="ticket.price" min="0" />
                      </div>
                    </div>

                    <!-- Max Tickets excluded from inline edit -->

                    <div class="edit-actions">
                      <button (click)="saveTicketEdit($index)" class="btn btn-sm btn-primary">
                        Save
                      </button>
                      <button (click)="cancelEdit($index)" class="btn btn-sm btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                  }
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

              <button
                (click)="saveConfiguration()"
                class="btn btn-primary btn-block"
                [disabled]="saving"
              >
                {{ saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Save & Publish Event' }}
              </button>

              <button
                (click)="onCancel()"
                class="btn btn-secondary btn-block"
                style="margin-top: 0.5rem;"
                [disabled]="saving"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      /* ... existing styles ... */
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
        background: var(--neutral-white);
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
      }

      .page-header h1 {
        font-size: 2.5rem;
        margin: 0 0 0.5rem 0;
        color: var(--primary-900);
      }

      .page-header p {
        color: var(--primary-600);
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

        .ticket-item {
          flex-direction: column;
          align-items: center; /* Center items instead of stretching */
          gap: 1rem;
        }

        .ticket-info {
          text-align: center;
        }

        .allocation-controls {
          justify-content: center;
        }

        .item-actions {
          justify-content: center;
          border-top: 1px solid var(--primary-100);
          padding-top: 1rem;
        }
      }

      .card {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        margin-bottom: 2rem;
        border: 1px solid var(--primary-200);
      }

      .card h3 {
        margin: 0 0 1.5rem 0;
        color: var(--primary-900);
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
        color: var(--primary-900);
      }

      input,
      select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all var(--transition-fast);
      }

      input:focus,
      select:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
        border: 2px solid var(--primary-200);
        border-radius: 0.5rem;
        background: white;
      }

      .ticket-item.editing {
        background: var(--primary-100);
        border-color: var(--accent-300);
        display: block; /* Stack content in edit mode */
      }

      .ticket-info h4 {
        margin: 0 0 0.5rem 0;
        color: var(--primary-900);
      }

      .ticket-info p {
        margin: 0 0 0.25rem 0;
        color: var(--primary-600);
        font-size: 0.875rem;
      }

      .capacity {
        color: var(--accent-600);
        font-weight: 600;
      }

      .item-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn-icon {
        width: 36px;
        height: 36px;
        border: 2px solid var(--primary-200);
        background: var(--neutral-white);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-edit {
        color: var(--accent-600);
      }

      .btn-edit:hover {
        background: var(--accent-50);
        border-color: var(--accent-500);
      }

      .btn-remove {
        color: var(--error-600);
        border-color: var(--error-200);
      }

      .btn-remove:hover {
        background: var(--error-50);
        border-color: var(--error-600);
      }

      .allocation-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }

      .control-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--neutral-100);
        padding: 0.25rem;
        border-radius: 0.375rem;
      }

      .capacity-label {
        font-weight: 600;
        color: var(--primary-700);
        font-size: 0.875rem;
      }

      .capacity-value {
        font-weight: 700;
        min-width: 2rem;
        text-align: center;
      }

      .btn-micro {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        border: 1px solid var(--primary-300);
        background: white;
        color: var(--primary-700);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
      }

      .btn-micro:hover:not(:disabled) {
        background: var(--primary-50);
        border-color: var(--primary-400);
      }

      .btn-micro:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--neutral-100);
      }

      .waitlist-tag {
        font-size: 0.75rem;
        color: var(--accent-600);
        background: var(--accent-50);
        padding: 0.1rem 0.5rem;
        border-radius: 999px;
        font-weight: 600;
      }

      .btn-add {
        color: var(--success-600);
        border-color: var(--success-200);
        font-weight: bold;
      }

      .btn-add:hover {
        background: var(--success-50);
        border-color: var(--success-600);
      }

      .waitlist-added {
        display: inline-block;
        margin-left: 0.5rem;
        font-size: 0.75rem;
        color: var(--success-600);
        background: var(--success-100);
        padding: 0.1rem 0.4rem;
        border-radius: 999px;
        font-weight: 600;
      }

      .edit-form {
        width: 100%;
      }

      .edit-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
      }

      .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }

      .error-message {
        background: #fee2e2;
        color: var(--error-600);
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.875rem;
      }

      /* ... summary styles ... */
      .summary-card {
        background: var(--neutral-white);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 2rem;
      }

      .summary-card h3 {
        margin: 0 0 1.5rem 0;
        color: var(--primary-900);
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
        color: var(--primary-600);
        font-size: 0.875rem;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--accent-600);
      }

      .btn {
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
        font-size: 0.9375rem;
      }

      .btn-primary {
        background: var(--accent-600);
        color: var(--neutral-white);
      }

      .btn-primary:hover:not(:disabled) {
        background: var(--accent-700);
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      .btn-secondary {
        background: var(--primary-200);
        color: var(--primary-900);
      }

      .btn-secondary:hover {
        background: var(--primary-300);
      }

      .btn-block {
        width: 100%;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
})
export class TicketSetupComponent implements OnInit, CanComponentDeactivate {
  event: Event | undefined;
  TicketCategory = TicketCategory;
  SeatingSection = SeatingSection;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedChanges) {
      $event.returnValue = true;
    }
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Are you sure you want to go back?');
    }
    return true;
  }

  isSeatBooked(seat: string): boolean {
    return false; // Placeholder if needed or remove
  }

  getSectionCapacity(section: SeatingSection): number {
    switch (section) {
      case SeatingSection.STALL:
        return 75;
      case SeatingSection.MEZZANINE:
        return 50;
      case SeatingSection.BALCONY:
        return 25;
      default:
        return 100;
    }
  }

  newTicket: TicketTypeForm = {
    category: TicketCategory.GENERAL_ADMISSION,
    section: SeatingSection.STALL,
    price: 100,
    maxTickets: 100,
  };

  ticketTypes: TicketTypeForm[] = [];
  promoCode = '';
  promoDiscount = 0;
  promoExpiry = '';
  saving = false;
  addError = '';
  originalTicketState: Map<number, TicketTypeForm> = new Map();
  promoCodeId: string | undefined;
  hasUnsavedChanges = false;
  isEditMode = false;

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
          if (event) {
            this.isEditMode = event.status === 'PUBLISHED'; // Assuming string for now, preferably enum
            this.loadTickets(event.id);
            this.loadPromo(event.id);
          }
        },
      });
    }
  }

  loadTickets(eventId: string): void {
    this.ticketService.getTicketsByEvent(eventId).subscribe({
      next: (tickets) => {
        this.ticketTypes = tickets.map((t) => ({
          id: t.id,
          category: t.category,
          section: t.section,
          price: t.price,
          maxTickets: t.maxTickets,
          waitlistAllocation: t.waitlistAllocation || 0,
        }));
      },
    });
  }

  loadPromo(eventId: string): void {
    this.ticketService.getPromoCode(eventId).subscribe({
      next: (promo) => {
        if (promo) {
          this.promoCodeId = promo.id;
          this.promoCode = promo.code;
          this.promoDiscount = promo.discountPercentage;
          this.promoExpiry = new Date(promo.expiryDate).toISOString().split('T')[0];
        }
      },
    });
  }

  checkDuplicate(
    category: TicketCategory,
    section: SeatingSection,
    price: number,
    maxTickets: number
  ): boolean {
    return this.ticketTypes.some(
      (t) =>
        t.category === category &&
        t.section === section &&
        t.price === price &&
        t.maxTickets === maxTickets
    );
  }

  addTicketType(): void {
    this.addError = '';
    if (
      this.checkDuplicate(
        this.newTicket.category,
        this.newTicket.section,
        this.newTicket.price,
        this.newTicket.maxTickets
      )
    ) {
      this.addError = 'The same type of ticket already exists, edit existing instead.';
      return;
    }

    const maxCap = this.getSectionCapacity(this.newTicket.section);
    if (this.newTicket.maxTickets > maxCap) {
      this.addError = `Max tickets cannot exceed section capacity of ${maxCap}.`;
      return;
    }

    this.ticketTypes.push({
      ...this.newTicket,
    });
    this.hasUnsavedChanges = true;
    // Trigger rebuild
  }

  updateTicketAllocation(ticket: TicketTypeForm, change: number): void {
    if (!ticket.id) {
      // For new tickets, just update local
      const currentWaitlist = ticket.waitlistAllocation || 0;
      const newWaitlist = currentWaitlist + change;
      if (newWaitlist < 0) return;

      ticket.waitlistAllocation = newWaitlist;
      ticket.maxTickets += change;
      return;
    }

    const currentWaitlist = ticket.waitlistAllocation || 0;
    const newWaitlist = currentWaitlist + change;

    // Prevent negative waitlist allocation
    if (newWaitlist < 0) return;

    const newMax = ticket.maxTickets + change;
    const maxCap = this.getSectionCapacity(ticket.section);

    if (newMax > maxCap) {
      alert(`Cannot increase allocation. Max capacity for ${ticket.section} is ${maxCap}.`);
      return;
    }

    // DEFERRED UPDATE: Only update local state
    ticket.maxTickets = newMax;
    ticket.waitlistAllocation = newWaitlist;
    ticket.isModified = true;
    this.hasUnsavedChanges = true;
  }

  toggleEdit(index: number): void {
    // Save original state in case of cancel
    this.originalTicketState.set(index, {
      ...this.ticketTypes[index],
    });
    this.ticketTypes[index].isEditing = true;
  }

  cancelEdit(index: number): void {
    const original = this.originalTicketState.get(index);
    if (original) {
      this.ticketTypes[index] = original;
    }
    this.ticketTypes[index].isEditing = false;
    this.originalTicketState.delete(index);
  }

  saveTicketEdit(index: number): void {
    const ticket = this.ticketTypes[index];

    // Check for duplicates excluding self?
    // The user requirement said "edit feature... excluding category".
    // And duplicate check for "same type".
    // If I edit it to be exactly like another one, that's bad.

    const isDuplicate = this.ticketTypes.some(
      (t, i) =>
        i !== index &&
        t.category === ticket.category &&
        t.section === ticket.section &&
        t.price === ticket.price &&
        t.maxTickets === ticket.maxTickets
    );

    if (isDuplicate) {
      alert('This configuration duplicates another ticket type.');
      return;
    }

    if (ticket.id) {
      // Defer backend update
      ticket.isEditing = false;
      ticket.isModified = true;
      this.hasUnsavedChanges = true;
      this.originalTicketState.delete(index);
    } else {
      // Just local update for new unsaved tickets
      ticket.isEditing = false;
      this.hasUnsavedChanges = true;
      this.originalTicketState.delete(index);
    }
  }

  removeTicketType(index: number): void {
    const ticket = this.ticketTypes[index];
    if (ticket.id) {
      if (!confirm('Are you sure you want to delete this ticket type?')) return;
      this.ticketService.deleteTicketType(ticket.id).subscribe({
        next: () => {
          this.ticketTypes.splice(index, 1);
          // If we deleted a saved ticket, that's a change, but it's immediate for delete.
          // Ideally delete should also be deferred but user didn't explicitly ask for that and it's complex.
          // We'll leave delete as immediate but maybe set hasUnsavedChanges? No, it's saved.
        },
      });
    } else {
      this.ticketTypes.splice(index, 1);
      this.hasUnsavedChanges = true;
    }
  }

  getCategoryName(category: TicketCategory): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  getTotalCapacity(): number {
    return this.ticketTypes.reduce((sum, t) => sum + t.maxTickets, 0);
  }

  getPriceRange(): string {
    if (this.ticketTypes.length === 0) return 'N/A';
    const prices = this.ticketTypes.map((t) => t.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `RM ${min}` : `RM ${min} - ${max}`;
  }

  saveConfiguration(): void {
    if (!this.event) return;

    this.saving = true;

    const finalize = () => {
      // If creating event (Draft -> Published), publish it.
      // If editing (Published), just navigate back.
      if (!this.isEditMode) {
        this.eventService.publishEvent(this.event!.id).subscribe({
          next: () => {
            this.hasUnsavedChanges = false;
            this.router.navigate(['/organizer/dashboard']);
          },
          error: () => {
            this.saving = false;
          },
        });
      } else {
        this.hasUnsavedChanges = false;
        this.router.navigate(['/organizer/dashboard']);
      }
    };

    const newTickets = this.ticketTypes.filter((t) => !t.id);
    const modifiedTickets = this.ticketTypes.filter((t) => t.id && t.isModified);

    // Helper to process everything
    const processUpdates = () => {
      const updates: Observable<any>[] = [];

      // 1. Create New
      if (newTickets.length > 0) {
        const validNew = newTickets.map((t) => ({
          ...t,
          waitlistAllocation: t.waitlistAllocation || 0,
        }));
        updates.push(this.ticketService.createTicketTypes(this.event!.id, validNew));
      }

      // 2. Update Modified
      modifiedTickets.forEach((t) => {
        updates.push(
          this.ticketService.updateTicketType(t.id!, {
            section: t.section,
            price: t.price,
            maxTickets: t.maxTickets,
            waitlistAllocation: t.waitlistAllocation,
          })
        );
      });

      if (updates.length > 0) {
        let completed = 0;
        const checkDone = () => {
          completed++;
          if (completed === updates.length) {
            this.handlePromoAndPublish(finalize);
          }
        };

        updates.forEach((obs) =>
          obs.subscribe({
            next: () => checkDone(),
            error: () => {
              this.saving = false;
              alert('Error saving some changes.');
            },
          })
        );
      } else {
        this.handlePromoAndPublish(finalize);
      }
    };

    processUpdates();
  }

  onCancel(): void {
    this.hasUnsavedChanges = false;
    this.router.navigate(['/organizer/dashboard']);
  }

  private handlePromoAndPublish(callback: () => void): void {
    if (this.promoCode && this.promoDiscount > 0) {
      const promoData = {
        eventId: this.event!.id,
        code: this.promoCode,
        discountPercentage: this.promoDiscount,
        applicableCategories: this.ticketTypes.map((t) => t.category),
        expiryDate: new Date(this.promoExpiry),
        isActive: true,
      };

      if (this.promoCodeId) {
        // Update existing
        this.ticketService.updatePromoCode(this.promoCodeId, promoData).subscribe({
          next: () => callback(),
          error: () => callback(),
        });
      } else {
        // Create new
        this.ticketService.createPromoCode(promoData).subscribe({
          next: () => callback(),
          error: () => callback(),
        });
      }
    } else {
      callback();
    }
  }
}
