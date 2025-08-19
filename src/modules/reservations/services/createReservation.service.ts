import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
import { differenceInDays, parseISO } from 'date-fns';
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/IHotel.repositories';
import { HOTEL_REPOSITORY_TOKEN } from 'src/modules/hotels/utils/repositoriesTokens';
import { CreateReservationDTO } from '../domain/dto/create-reservation.dto';
import type { IReservationsRepository } from '../domain/repositories/IReservations.repository';
import { RESERVATIONS_REPOSITORY_TOKEN } from '../utils/repositoriesToken';

@Injectable()
export class CreateReservationService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationsRepository,
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
  ) {}
  async create(id: number, data: CreateReservationDTO) {
    // Validate and parse dates
    if (!data.checkIn || !data.checkOut) {
      throw new BadRequestException(
        'Check-in and check-out dates are required',
      );
    }

    const checkInDate = parseISO(data.checkIn);
    const checkOutDate = parseISO(data.checkOut);

    // Validate parsed dates
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Use ISO 8601 format (YYYY-MM-DD)',
      );
    }

    const daysOfStay = differenceInDays(checkOutDate, checkInDate);

    if (checkInDate >= checkOutDate) {
      throw new BadRequestException(
        'Check-in date must be before check-out date',
      );
    }

    const hotel = await this.hotelRepository.findHotelById(data.hotelId);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (typeof hotel.price !== 'number' || hotel.price <= 0) {
      throw new BadRequestException('Invalid hotel price');
    }

    const total = daysOfStay * hotel.price;

    const newReservation = {
      ...data,
      total,
      userId: id,
      status: data.status ?? ReservationStatus.PENDING,
    };

    return this.reservationRepository.create(newReservation);
  }
}
