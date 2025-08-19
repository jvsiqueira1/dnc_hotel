import { ReservationStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateReservationDTO {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  hotelId: number;

  @IsDateString()
  @IsNotEmpty()
  checkIn: string;

  @IsDateString()
  @IsNotEmpty()
  checkOut: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  @Transform(({ value }) => value ?? ReservationStatus.PENDING)
  status?: ReservationStatus;
}
