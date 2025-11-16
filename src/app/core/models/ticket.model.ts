// src/app/core/models/ticket.model.ts

export enum TicketCategory {
  GENERAL_ADMISSION = 'GENERAL_ADMISSION',
  VIP = 'VIP',
  SENIOR_CITIZEN = 'SENIOR_CITIZEN',
  CHILD = 'CHILD'
}

export enum SeatingSection {
  BALCONY = 'BALCONY',
  MEZZANINE = 'MEZZANINE',
  STALL = 'STALL'
}

export interface TicketType {
  id: string;
  eventId: string;
  category: TicketCategory;
  price: number;
  section: SeatingSection;
  maxTickets: number;
  soldTickets: number;
  availableTickets: number;
}

export interface PromotionalCode {
  id: string;
  eventId: string;
  code: string;
  discountPercentage: number;
  applicableCategories: TicketCategory[];
  expiryDate: Date;
  isActive: boolean;
}

export interface SeatingLayout {
  balcony: number;
  mezzanine: number;
  stall: number;
}
