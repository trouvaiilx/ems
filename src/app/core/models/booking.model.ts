// src/app/core/models/booking.model.ts

import { TicketCategory, SeatingSection } from './ticket.model';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Booking {
  id: string;
  eventId: string;
  eventName: string;
  attendeeId: string;
  attendeeName: string;
  attendeeEmail: string;
  tickets: BookingTicket[];
  totalAmount: number;
  discountApplied: number;
  finalAmount: number;
  promoCode?: string;
  qrCode: string;
  status: BookingStatus;
  bookingDate: Date;
  checkedIn: boolean;
  checkedInAt?: Date;
}

export interface BookingTicket {
  ticketTypeId: string;
  category: TicketCategory;
  section: SeatingSection;
  seatNumber: string;
  price: number;
}

export interface CreateBookingRequest {
  eventId: string;
  tickets: {
    ticketTypeId: string;
    quantity: number;
    seatNumbers: string[];
    category: TicketCategory;
    section: SeatingSection;
    price: number;
  }[];
  promoCode?: string;
}

export interface Waitlist {
  id: string;
  eventId: string;
  attendeeId: string;
  attendeeEmail: string;
  attendeePhone: string;
  joinedAt: Date;
  notified: boolean;
}
