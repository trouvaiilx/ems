// src/app/core/models/event.model.ts

export interface Event {
  id: string;
  name: string;
  description: string;
  date: Date;
  time: string;
  posterUrl?: string;
  organizerId: string;
  organizerName: string;
  createdAt: Date;
  updatedAt: Date;
  status: EventStatus;
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface CreateEventRequest {
  name: string;
  description: string;
  date: Date;
  time: string;
  posterUrl?: string;
}
