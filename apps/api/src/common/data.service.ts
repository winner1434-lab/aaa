import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { authenticator } from 'otplib';
import { AuditLog, Event, Property, Rate, User } from './types';

@Injectable()
export class DataService {
  users: User[] = [
    {
      id: 1,
      username: 'admin',
      passwordHash: hashSync('Admin1234', 10),
      role: 'ADMIN',
      totpSecret: authenticator.generateSecret(),
      propertyIds: [1, 2],
    },
    {
      id: 2,
      username: 'am1',
      passwordHash: hashSync('Am123456', 10),
      role: 'AM',
      totpSecret: authenticator.generateSecret(),
      propertyIds: [1],
    },
  ];

  properties: Property[] = [
    { id: 1, name: '台北敦謙館', lat: 25.0478, lng: 121.5319 },
    { id: 2, name: '高雄敦謙館', lat: 22.6273, lng: 120.3014 },
  ];

  rates: Rate[] = [
    {
      id: 1,
      propertyId: 1,
      roomType: 'Standard',
      date: '2025-03-15',
      originalRate: 3600,
      finalRate: 3600,
      source: 'ORIGINAL',
      status: 'OPEN',
    },
  ];

  events: Event[] = [];
  auditLogs: AuditLog[] = [];
}
