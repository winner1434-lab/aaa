import { Injectable } from '@nestjs/common';

@Injectable()
export class PmsService {
  async fetchBaseRates(propertyId: number, from: string, to: string) {
    return [
      {
        propertyId,
        roomType: 'Standard',
        date: from,
        originalRate: 3800,
      },
      {
        propertyId,
        roomType: 'Deluxe',
        date: to,
        originalRate: 5200,
      },
    ];
  }

  async syncRates(payload: unknown) {
    return { success: true, message: '同步完成', payload };
  }
}
