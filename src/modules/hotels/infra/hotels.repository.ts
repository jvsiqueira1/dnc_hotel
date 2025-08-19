import { Injectable } from '@nestjs/common';
import { Hotel } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateHotelDTO } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDTO } from '../domain/dto/update-hotel.dto';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';

@Injectable()
export class HotelsRepositories implements IHotelRepository {
  constructor(private readonly prisma: PrismaService) {}

  createHotel(data: CreateHotelDTO, id: number): Promise<Hotel> {
    const hotelData = { ...data, ownerId: id };
    return this.prisma.hotel.create({ data: hotelData });
  }

  findHotelById(id: number): Promise<Hotel | null> {
    return this.prisma.hotel.findUnique({
      where: { id: Number(id) },
      include: { owner: true },
    });
  }

  findHotelByName(name: string): Promise<Hotel[] | null> {
    return this.prisma.hotel.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  findHotels(offSet: number, limit: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({
      take: limit,
      skip: offSet,
      include: {
        owner: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });
  }

  countHotels(): Promise<number> {
    return this.prisma.hotel.count();
  }

  findHotelByOwner(ownerId: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({ where: { ownerId } });
  }

  updateHotel(id: number, data: UpdateHotelDTO): Promise<Hotel> {
    return this.prisma.hotel.update({ where: { id }, data });
  }
  deleteHotel(id: number): Promise<Hotel> {
    return this.prisma.hotel.delete({ where: { id } });
  }
}
