import { Inject, Injectable } from '@nestjs/common';
import type { IReservationsRepository } from '../domain/repositories/IReservations.repository';
import { RESERVATIONS_REPOSITORY_TOKEN } from '../utils/repositoriesToken';

@Injectable()
export class FindByIdReservationsService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationsRepository,
  ) {}

  async execute(id: number) {
    return await this.reservationRepository.findById(id);
  }
}
