// src/app/features/attendee/payment/payment.component.ts (FIXED)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payment-page">
      <div class="container">
        @if (booking) {
          <div class="payment-grid">
            <div class="main-content">
              <div class="card">
                <h2>Payment Method</h2>
                <div class="payment-methods">
                  <label class="payment-option" [class.selected]="paymentMethod === 'card'">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="card" 
                      [(ngModel)]="paymentMethod"
                    />
                    <div class="option-content">
                      <span class="option-icon">💳</span>
                      <div>
                        <h4>Credit/Debit Card</h4>
                        <p>Pay securely with your card</p>
                      </div>
                    </div>
                  </label>

                  <label class="payment-option" [class.selected]="paymentMethod === 'ewallet'">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="ewallet" 
                      [(ngModel)]="paymentMethod"
                    />
                    <div class="option-content">
                      <span class="option-icon">📱</span>
                      <div>
                        <h4>E-Wallet</h4>
                        <p>GrabPay, Touch 'n Go, Boost</p>
                      </div>
                    </div>
                  </label>

                  <label class="payment-option" [class.selected]="paymentMethod === 'online'">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="online" 
                      [(ngModel)]="paymentMethod"
                    />
                    <div class="option-content">
                      <span class="option-icon">🏦</span>
                      <div>
                        <h4>Online Banking</h4>
                        <p>FPX payment gateway</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              @if (paymentMethod === 'card') {
                <div class="card">
                  <h3>Card Details</h3>
                  <div class="form-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      [(ngModel)]="cardNumber"
                      maxlength="19"
                    />
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        [(ngModel)]="expiryDate"
                        maxlength="5"
                      />
                    </div>
                    <div class="form-group">
                      <label>CVV</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        [(ngModel)]="cvv"
                        maxlength="3"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="Name on card"
                      [(ngModel)]="cardholderName"
                    />
                  </div>
                </div>
              }

              <div class="secure-notice">
                <span class="icon">🔒</span>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </div>

            <div class="sidebar">
              <div class="summary-card">
                <h3>Order Summary</h3>
                <div class="event-info">
                  <h4>{{ booking.eventName }}</h4>
                  <p>{{ booking.tickets.length }} Ticket(s)</p>
                </div>

                <div class="divider"></div>

                <div class="price-breakdown">
                  <div class="price-row">
                    <span>Subtotal</span>
                    <span>RM {{ booking.totalAmount }}</span>
                  </div>
                  @if (booking.discountApplied > 0) {
                    <div class="price-row discount">
                      <span>Discount</span>
                      <span>-RM {{ booking.discountApplied }}</span>
                    </div>
                  }
                  <div class="divider"></div>
                  <div class="price-row total">
                    <span>Total</span>
                    <span>RM {{ booking.finalAmount }}</span>
                  </div>
                </div>

                <button 
                  (click)="processPayment()" 
                  class="btn btn-primary btn-block"
                  [disabled]="processing || !isPaymentValid()"
                >
                  {{ processing ? 'Processing...' : 'Pay RM ' + booking.finalAmount }}
                </button>

                @if (errorMessage) {
                  <p class="error-message">{{ errorMessage }}</p>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .payment-page {
      min-height: 100vh;
      background: #f9fafb;
      padding: 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .payment-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
    }

    @media (max-width: 968px) {
      .payment-grid {
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

    .card h2,
    .card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .payment-option {
      display: block;
      padding: 1.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .payment-option:hover {
      border-color: #6366f1;
      background: #f9fafb;
    }

    .payment-option.selected {
      border-color: #6366f1;
      background: #f0f1ff;
    }

    .payment-option input[type="radio"] {
      display: none;
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .option-icon {
      font-size: 2.5rem;
    }

    .option-content h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .option-content p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
      font-size: 0.875rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #6366f1;
    }

    .secure-notice {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #d1fae5;
      border-radius: 0.5rem;
      border: 1px solid #a7f3d0;
    }

    .secure-notice .icon {
      font-size: 1.5rem;
    }

    .secure-notice p {
      margin: 0;
      color: #065f46;
      font-size: 0.875rem;
      font-weight: 500;
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

    .event-info h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.125rem;
    }

    .event-info p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 1.5rem 0;
    }

    .price-breakdown {
      margin-bottom: 1.5rem;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      color: #666;
    }

    .price-row.discount {
      color: #059669;
      font-weight: 600;
    }

    .price-row.total {
      font-size: 1.25rem;
      font-weight: 700;
      color: #333;
      margin-top: 0.75rem;
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
      font-size: 1.125rem;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4f46e5;
      transform: translateY(-2px);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      color: #dc2626;
      margin: 1rem 0 0 0;
      font-size: 0.875rem;
      text-align: center;
    }
  `]
})
export class PaymentComponent implements OnInit {
  booking: Booking | undefined;
  paymentMethod = 'card';
  cardNumber = '';
  expiryDate = '';
  cvv = '';
  cardholderName = '';
  processing = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    
    // Try to get booking from localStorage first
    const storedBooking = localStorage.getItem('current_booking');
    if (storedBooking) {
      this.booking = JSON.parse(storedBooking);
    } else if (bookingId) {
      // Fallback to service
      this.bookingService.getBookingById(bookingId).subscribe({
        next: (booking) => {
          this.booking = booking;
        }
      });
    }
  }

  isPaymentValid(): boolean {
    if (this.paymentMethod === 'card') {
      return this.cardNumber.length >= 16 &&
             this.expiryDate.length === 5 &&
             this.cvv.length === 3 &&
             this.cardholderName.length > 0;
    }
    return true;
  }

  processPayment(): void {
    if (!this.booking) return;

    this.processing = true;
    this.errorMessage = '';

    // Simulate payment processing
    setTimeout(() => {
      this.bookingService.confirmBooking(this.booking!.id).subscribe({
        next: () => {
          // Clear stored booking
          localStorage.removeItem('current_booking');
          this.router.navigate(['/my-tickets'], {
            queryParams: { success: 'true' }
          });
        },
        error: () => {
          this.errorMessage = 'Payment failed. Please try again.';
          this.processing = false;
        }
      });
    }, 2000);
  }
}
