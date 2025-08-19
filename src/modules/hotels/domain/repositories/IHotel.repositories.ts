import type { Hotel } from '@prisma/client';
import { CreateHotelDTO } from '../dto/create-hotel.dto';
import { UpdateHotelDTO } from '../dto/update-hotel.dto';

export interface IHotelRepository {
  createHotel(data: CreateHotelDTO, id: number): Promise<Hotel>;
  findHotelById(id: number): Promise<Hotel | null>;
  findHotelByName(name: string): Promise<Hotel[] | null>;
  findHotels(offSet: number, limit: number): Promise<Hotel[]>;
  findHotelByOwner(ownerId: number): Promise<Hotel[]>;
  updateHotel(id: number, data: UpdateHotelDTO): Promise<Hotel>;
  deleteHotel(id: number): Promise<Hotel>;
  countHotels(): Promise<number>;
}
