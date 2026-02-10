import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DataService } from './common/data.service';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { PmsService } from './pms/pms.service';
import { PropertiesController } from './properties/properties.controller';
import { RatesController } from './rates/rates.controller';
import { RatesService } from './rates/rates.service';

@Module({
  imports: [JwtModule.register({ secret: 'dev-secret-key' })],
  controllers: [AuthController, PropertiesController, RatesController, EventsController, AuditController],
  providers: [DataService, AuthService, RatesService, PmsService, EventsService, AuditService],
})
export class AppModule {}
