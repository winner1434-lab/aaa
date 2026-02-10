import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import { DataService } from '../common/data.service';
import { PmsService } from '../pms/pms.service';
import { ManualOverrideDto, QueryRatesDto } from './dto';

@Injectable()
export class RatesService {
  constructor(
    private readonly data: DataService,
    private readonly pms: PmsService,
    private readonly audit: AuditService,
  ) {}

  async query(user: { sub: number; role: 'ADMIN' | 'AM'; propertyIds: number[] }, dto: QueryRatesDto) {
    this.assertPropertyAccess(user, dto.propertyId);

    const rows = this.data.rates.filter((r) => r.propertyId === dto.propertyId && r.date >= dto.from && r.date <= dto.to);
    if (rows.length === 0 || dto.forceRefresh) {
      const fetched = await this.pms.fetchBaseRates(dto.propertyId, dto.from, dto.to);
      fetched.forEach((f) => {
        this.data.rates.push({
          id: this.data.rates.length + 1,
          propertyId: f.propertyId,
          roomType: f.roomType,
          date: f.date,
          originalRate: f.originalRate,
          finalRate: f.originalRate,
          source: 'ORIGINAL',
          status: 'OPEN',
        });
      });
    }

    return this.data.rates.filter((r) => r.propertyId === dto.propertyId && r.date >= dto.from && r.date <= dto.to);
  }

  manualOverride(user: { sub: number; role: 'ADMIN' | 'AM'; propertyIds: number[] }, dto: ManualOverrideDto) {
    this.assertPropertyAccess(user, dto.propertyId);

    const rate = this.data.rates.find((r) => r.propertyId === dto.propertyId && r.roomType === dto.roomType && r.date === dto.date);
    if (!rate) {
      throw new NotFoundException('找不到指定日期房價');
    }

    const before = { ...rate };
    if (dto.finalRate) {
      rate.finalRate = dto.finalRate;
    }
    if (dto.status) {
      rate.status = dto.status;
    }
    rate.source = 'MANUAL';

    this.audit.add(user.sub, 'MANUAL_OVERRIDE', 'Rate', String(rate.id), before, rate);
    return rate;
  }

  async sync(user: { sub: number; role: 'ADMIN' | 'AM'; propertyIds: number[] }, propertyId: number) {
    this.assertPropertyAccess(user, propertyId);
    const payload = this.data.rates.filter((r) => r.propertyId === propertyId);
    const result = await this.pms.syncRates(payload);
    this.audit.add(user.sub, 'SYNC_PMS', 'Property', String(propertyId), null, result);
    return result;
  }

  private assertPropertyAccess(user: { role: 'ADMIN' | 'AM'; propertyIds: number[] }, propertyId: number) {
    if (user.role === 'ADMIN') return;
    if (!user.propertyIds.includes(propertyId)) {
      throw new ForbiddenException('無權限操作此物件');
    }
  }
}
