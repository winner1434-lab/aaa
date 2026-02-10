import { IsDateString, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryRatesDto {
  @IsInt()
  propertyId!: number;

  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;

  @IsOptional()
  forceRefresh?: boolean;
}

export class ManualOverrideDto {
  @IsInt()
  propertyId!: number;

  @IsString()
  roomType!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  finalRate?: number;

  @IsOptional()
  @IsIn(['OPEN', 'STOP_SELL'])
  status?: 'OPEN' | 'STOP_SELL';
}
