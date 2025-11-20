// src/app/features/attendee/payment/payment.component.ts

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
        <div class="payment-header">
          <div class="security-badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Secure Payment</span>
          </div>
          <h1>Complete Your Booking</h1>
          <p>Enter your payment details to confirm your tickets</p>
        </div>

        <div class="payment-grid">
          <div class="main-content">
            <div class="payment-card">
              <div class="card-header">
                <h2>Payment Method</h2>
              </div>
              <div class="card-content">
                <div class="payment-methods">
                  <label class="payment-option" [class.selected]="paymentMethod === 'card'">
                    <input type="radio" name="payment" value="card" [(ngModel)]="paymentMethod" />
                    <div class="option-content">
                      <div class="option-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
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
                      <div class="option-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4>E-Wallet</h4>
                        <p>GrabPay, Touch 'n Go, Boost</p>
                      </div>
                    </div>
                  </label>

                  <label class="payment-option" [class.selected]="paymentMethod === 'online'">
                    <input type="radio" name="payment" value="online" [(ngModel)]="paymentMethod" />
                    <div class="option-content">
                      <div class="option-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4>Online Banking</h4>
                        <p>FPX payment gateway</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            @if (paymentMethod === 'card') {
            <div class="payment-card">
              <div class="card-header">
                <h3>Card Details</h3>
              </div>
              <div class="card-content">
                <div class="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    [(ngModel)]="cardNumber"
                    maxlength="19"
                    class="form-input"
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
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      [(ngModel)]="cvv"
                      maxlength="3"
                      class="form-input"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    [(ngModel)]="cardholderName"
                    class="form-input"
                  />
                </div>
              </div>
            </div>
            }

            <div class="secure-notice">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <p>Your payment information is encrypted and secure</p>
            </div>
          </div>

          <div class="sidebar">
            <div class="summary-card">
              <div class="card-header">
                <h3>Order Summary</h3>
              </div>
              <div class="card-content">
                <div class="event-info">
                  <h4>{{ booking.eventName }}</h4>
                  <p>{{ booking.tickets.length }} Ticket(s)</p>
                </div>

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
                  @if (processing) {
                  <span class="spinner-sm"></span>
                  }
                  <span>{{ processing ? 'Processing...' : 'Pay RM ' + booking.finalAmount }}</span>
                </button>

                @if (errorMessage) {
                <div class="alert alert-error">
                  <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ errorMessage }}</span>
                </div>
                }
              </div>
            </div>

            <div class="security-info">
              <div class="security-item">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>256-bit SSL Encryption</span>
              </div>
              <div class="security-item">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>PCI DSS Compliant</span>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .payment-page {
        min-height: 100vh;
        background: var(--primary-100);
        padding: 2rem 1rem 4rem;
      }

      .payment-header {
        max-width: 1200px;
        margin: 0 auto 2.5rem;
        text-align: center;
      }

      .security-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--success-100);
        color: var(--success-700);
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }

      .security-badge svg {
        width: 1.125rem;
        height: 1.125rem;
      }

      .payment-header h1 {
        font-size: 2.5rem;
        color: var(--primary-900);
        margin-bottom: 0.5rem;
      }

      .payment-header p {
        color: var(--primary-600);
        font-size: 1.125rem;
        margin: 0;
      }

      .payment-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .payment-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--primary-200);
        overflow: hidden;
        margin-bottom: 2rem;
      }

      .card-header {
        padding: 1.75rem;
        border-bottom: 1px solid var(--primary-200);
      }

      .card-header h2,
      .card-header h3 {
        margin: 0;
        color: var(--primary-900);
        font-size: 1.25rem;
      }

      .card-content {
        padding: 2rem;
      }

      .payment-methods {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .payment-option {
        display: block;
        padding: 1.5rem;
        border: 2px solid var(--primary-200);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .payment-option:hover {
        border-color: var(--accent-500);
        background: var(--primary-100);
      }

      .payment-option.selected {
        border-color: var(--accent-600);
        background: var(--accent-300);
      }

      .payment-option input[type='radio'] {
        display: none;
      }

      .option-content {
        display: flex;
        align-items: center;
        gap: 1.25rem;
      }

      .option-icon {
        width: 3rem;
        height: 3rem;
        background: var(--accent-300);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .payment-option.selected .option-icon {
        background: var(--accent-600);
      }

      .option-icon svg {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--accent-800);
        stroke-width: 2;
      }

      .payment-option.selected .option-icon svg {
        color: var(--neutral-white);
      }

      .option-content h4 {
        margin: 0 0 0.25rem 0;
        color: var(--primary-900);
        font-size: 1rem;
      }

      .option-content p {
        margin: 0;
        color: var(--primary-600);
        font-size: 0.875rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--primary-900);
        font-size: 0.875rem;
      }

      .form-input {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--primary-300);
        border-radius: var(--radius-md);
        font-size: 1rem;
        transition: all var(--transition-fast);
      }

      .form-input:focus {
        outline: none;
        border-color: var(--accent-500);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .form-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1rem;
      }

      .secure-notice {
        display: flex;
        align-items: center;
        gap: 0.875rem;
        padding: 1.25rem;
        background: var(--success-100);
        border-radius: var(--radius-lg);
        border: 1px solid var(--success-600);
      }

      .secure-notice svg {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--success-600);
        flex-shrink: 0;
      }

      .secure-notice p {
        margin: 0;
        color: var(--success-700);
        font-size: 0.875rem;
        font-weight: 500;
      }

      .summary-card {
        background: var(--neutral-white);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--primary-200);
        position: sticky;
        top: 2rem;
        overflow: hidden;
        margin-bottom: 1.5rem;
      }

      .event-info {
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--primary-200);
        margin-bottom: 1.5rem;
      }

      .event-info h4 {
        margin: 0 0 0.5rem 0;
        color: var(--primary-900);
        font-size: 1.125rem;
      }

      .event-info p {
        margin: 0;
        color: var(--primary-600);
        font-size: 0.875rem;
      }

      .price-breakdown {
        margin-bottom: 1.5rem;
      }

      .price-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        color: var(--primary-700);
      }

      .price-row.discount {
        color: var(--success-600);
        font-weight: 600;
      }

      .divider {
        height: 1px;
        background: var(--primary-200);
        margin: 1rem 0;
      }

      .price-row.total {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-900);
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: var(--radius-md);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-base);
        font-size: 0.9375rem;
      }

      .btn-block {
        width: 100%;
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

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner-sm {
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .alert {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-top: 1rem;
      }

      .alert-error {
        background: var(--error-100);
        border: 1px solid var(--error-600);
        color: var(--error-700);
      }

      .alert-icon {
        width: 1.125rem;
        height: 1.125rem;
        flex-shrink: 0;
      }

      .security-info {
        background: var(--primary-100);
        padding: 1.25rem;
        border-radius: var(--radius-lg);
        border: 1px solid var(--primary-200);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .security-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        color: var(--primary-700);
        font-size: 0.8125rem;
        font-weight: 500;
      }

      .security-item svg {
        width: 1rem;
        height: 1rem;
        color: var(--success-600);
        flex-shrink: 0;
      }

      @media (max-width: 968px) {
        .payment-grid {
          grid-template-columns: 1fr;
        }

        .summary-card {
          position: static;
        }

        .form-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
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

    const storedBooking = localStorage.getItem('current_booking');
    if (storedBooking) {
      this.booking = JSON.parse(storedBooking);
    } else if (bookingId) {
      this.bookingService.getBookingById(bookingId).subscribe({
        next: (booking) => {
          this.booking = booking;
        },
      });
    }
  }

  isPaymentValid(): boolean {
    if (this.paymentMethod === 'card') {
      return (
        this.cardNumber.length >= 16 &&
        this.expiryDate.length === 5 &&
        this.cvv.length === 3 &&
        this.cardholderName.length > 0
      );
    }
    return true;
  }

  processPayment(): void {
    if (!this.booking) return;

    this.processing = true;
    this.errorMessage = '';

    setTimeout(() => {
      this.bookingService.confirmBooking(this.booking!.id).subscribe({
        next: () => {
          localStorage.removeItem('current_booking');
          this.router.navigate(['/my-tickets'], {
            queryParams: { success: 'true' },
          });
        },
        error: () => {
          this.errorMessage = 'Payment failed. Please try again.';
          this.processing = false;
        },
      });
    }, 2000);
  }
}
