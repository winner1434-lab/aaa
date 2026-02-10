import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { DataService } from '../common/data.service';

@Controller('properties')
@UseGuards(JwtGuard)
export class PropertiesController {
  constructor(private readonly data: DataService) {}

  @Get()
  list(@Req() req: { user: { role: 'ADMIN' | 'AM'; propertyIds: number[] } }) {
    if (req.user.role === 'ADMIN') return this.data.properties;
    return this.data.properties.filter((p) => req.user.propertyIds.includes(p.id));
  }
}
