// src/app/core/models/user.model.ts

export enum UserRole {
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
  ATTENDEE = 'ATTENDEE'
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  organizationName?: string;
  role: UserRole;
  isFirstLogin: boolean;
  createdAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
