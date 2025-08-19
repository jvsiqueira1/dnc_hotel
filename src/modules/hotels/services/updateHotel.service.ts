import { InjectRedis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { UpdateHotelDTO } from '../domain/dto/update-hotel.dto';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { REDIS_HOTEL_KEY } from '../utils/redisKey';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';

@Injectable()
export class UpdateHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async execute(id: number, updateHotelDto: UpdateHotelDTO) {
    await this.redis.del(REDIS_HOTEL_KEY);

    return await this.hotelRepositories.updateHotel(id, updateHotelDto);
  }
}
