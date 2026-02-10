import { Injectable } from '@nestjs/common';
import { DataService } from '../common/data.service';

@Injectable()
export class AuditService {
  constructor(private readonly data: DataService) {}

  add(userId: number, action: string, entityType: string, entityId: string, oldValue: unknown, newValue: unknown) {
    this.data.auditLogs.push({
      id: this.data.auditLogs.length + 1,
      userId,
      action,
      entityType,
      entityId,
      oldValue: oldValue as Record<string, unknown> | null,
      newValue: newValue as Record<string, unknown> | null,
      createdAt: new Date().toISOString(),
    });
  }

  list() {
    return this.data.auditLogs;
  }
}
