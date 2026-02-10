export type Role = 'ADMIN' | 'AM';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: Role;
  totpSecret?: string;
  propertyIds: number[];
}

export interface Property {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export type RateSource = 'ORIGINAL' | 'MANUAL' | 'EVENT_STOP_SELL';
export type RateStatus = 'OPEN' | 'STOP_SELL';

export interface Rate {
  id: number;
  propertyId: number;
  roomType: string;
  date: string;
  originalRate: number;
  finalRate: number;
  source: RateSource;
  status: RateStatus;
}

export interface Event {
  id: number;
  name: string;
  eventDate: string;
  venue: string;
  lat: number;
  lng: number;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  source: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
}
