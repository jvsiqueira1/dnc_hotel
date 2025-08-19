import { Inject, Injectable } from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
import type { IReservationsRepository } from '../domain/repositories/IReservations.repository';
import { RESERVATIONS_REPOSITORY_TOKEN } from '../utils/repositoriesToken';

@Injectable()
export class UpdateStatusReservationsService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationsRepository,
  ) {}

  async execute(id: number, status: ReservationStatus) {
    return await this.reservationRepository.updateStatus(id, status);
  }
}
