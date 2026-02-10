import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { ManualOverrideDto, QueryRatesDto } from './dto';
import { RatesService } from './rates.service';

@Controller('rates')
@UseGuards(JwtGuard)
export class RatesController {
  constructor(private readonly rates: RatesService) {}

  @Get()
  async query(@Req() req: { user: { sub: number; role: 'ADMIN' | 'AM'; propertyIds: number[] } }, @Query() query: QueryRatesDto) {
    return this.rates.query(req.user, query);
  }

  @Post('manual-override')
  manualOverride(
    @Req() req: { user: { sub: number; role: 'ADMIN' | 'AM'; propertyIds: number[] } },
    @Body() body: ManualOverrideDto,
  ) {
    return this.rates.manualOverride(req.user, body);
  }

  @Post('sync')
  sync(
    @Req() req: { user: { sub: number; role: 'ADMIN' | 'AM'; propertyIds: number[] } },
    @Body() body: { propertyId: number },
  ) {
    return this.rates.sync(req.user, body.propertyId);
  }
}
