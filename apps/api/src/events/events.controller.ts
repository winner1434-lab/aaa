import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IsDateString, IsIn, IsNumber, IsString } from 'class-validator';
import { JwtGuard } from '../auth/jwt.guard';
import { EventsService } from './events.service';

class CreateEventDto {
  @IsString()
  name!: string;

  @IsDateString()
  eventDate!: string;

  @IsString()
  venue!: string;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsIn(['HIGH', 'MEDIUM', 'LOW'])
  impactLevel!: 'HIGH' | 'MEDIUM' | 'LOW';

  @IsString()
  source!: string;
}

@Controller('events')
@UseGuards(JwtGuard)
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Post()
  add(@Body() body: CreateEventDto) {
    return this.events.addEvent(body);
  }

  @Get()
  list() {
    return this.events.list();
  }
}
