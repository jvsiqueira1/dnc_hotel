import { Inject, Injectable } from '@nestjs/common';
import { UpdateHotelDTO } from '../domain/dto/update-hotel.dto';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';

@Injectable()
export class UpdateHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ) {}
  async execute(id: number, updateHotelDto: UpdateHotelDTO) {
    return await this.hotelRepositories.updateHotel(id, updateHotelDto);
  }
}
