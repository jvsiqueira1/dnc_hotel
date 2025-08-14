import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { stat, unlink } from 'fs/promises';
import { join, resolve } from 'path';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';

@Injectable()
export class UploadImageHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ) {}
  async execute(id: string, imageFilename: string) {
    const hotel = await this.hotelRepositories.findHotelById(Number(id));
    const directory = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads-hotel',
    );

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.image) {
      const hotelImageFilePath = join(directory, hotel.image);
      const hotelImageFileExists = await stat(hotelImageFilePath);

      if (hotelImageFileExists) {
        await unlink(hotelImageFilePath);
      }
    }

    return await this.hotelRepositories.updateHotel(Number(id), {
      image: imageFilename,
    });
  }
}
