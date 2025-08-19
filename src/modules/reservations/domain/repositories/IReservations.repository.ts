import { Reservation, ReservationStatus } from '@prisma/client';

export interface CreateReservationData {
  hotelId: number;
  checkIn: string;
  checkOut: string;
  total: number;
  userId: number;
  status?: ReservationStatus;
}

export interface IReservationsRepository {
  create(data: CreateReservationData): Promise<Reservation>;
  findById(id: number): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  findByUser(userId: number): Promise<Reservation[]>;
  updateStatus(id: number, status: ReservationStatus): Promise<Reservation>;
}
