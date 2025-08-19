import { Injectable } from '@nestjs/common';
import { Reservation, ReservationStatus } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateReservationData,
  IReservationsRepository,
} from '../domain/repositories/IReservations.repository';

@Injectable()
export class ReservationRepository implements IReservationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReservationData): Promise<Reservation> {
    // Convert string dates to Date objects for Prisma
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    // Validate that dates are valid
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new Error('Invalid date format provided to repository');
    }

    const processedData = {
      ...data,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    };

    return this.prisma.reservation.create({ data: processedData });
  }

  findById(id: number): Promise<Reservation | null> {
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }

  findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }

  findByUser(userId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({ where: { userId } });
  }

  updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    return this.prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }
}
