import { ReservationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateReservationStatusDTO {
  @IsEnum(ReservationStatus, {
    message: 'Status must be one of: PENDING, CONFIRMED, CANCELLED',
  })
  @IsNotEmpty()
  status: ReservationStatus;
}
