import { MailerService } from '@nestjs-modules/mailer';
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
import { UserService } from 'src/modules/users/user.services';
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
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
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

    const hotelOwner = await this.userService.show(hotel.ownerId);

    await this.mailerService.sendMail({
      to: hotelOwner.email,
      subject: 'Pending Reservation Approval',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reservation Pending Approval</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .reservation-card { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #555; }
            .detail-value { color: #333; }
            .status-pending { background-color: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .total-amount { font-size: 18px; font-weight: bold; color: #27ae60; }
            .guest-info { background-color: #e8f4fd; padding: 15px; border-radius: 6px; margin-top: 15px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">🏨 New Reservation Request</h1>
            <p style="margin: 10px 0 0 0;">Pending Your Approval</p>
          </div>
          
          <div class="content">
            <p>Hello <strong>${hotelOwner.name}</strong>,</p>
            <p>You have received a new reservation request for your hotel <strong>${hotel.name}</strong>. Please review the details below and take appropriate action.</p>
            
            <div class="reservation-card">
              <h3 style="margin-top: 0; color: #2c3e50;">📋 Reservation Details</h3>
              
              <div class="detail-row">
                <span class="detail-label">🏨 Hotel:</span>
                <span class="detail-value">${hotel.name}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">📅 Check-in:</span>
                <span class="detail-value">${new Date(data.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">📅 Check-out:</span>
                <span class="detail-value">${new Date(data.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">🌙 Duration:</span>
                <span class="detail-value">${daysOfStay} night${daysOfStay > 1 ? 's' : ''}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">📊 Status:</span>
                <span class="detail-value"><span class="status-pending">${data.status || 'PENDING'}</span></span>
              </div>
              
              <div class="detail-row" style="border-bottom: none; margin-top: 10px;">
                <span class="detail-label">💰 Total Amount:</span>
                <span class="detail-value total-amount">$${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="guest-info">
              <h4 style="margin-top: 0; color: #2c3e50;">👤 Guest Information</h4>
              <p><strong>Name:</strong> ${hotelOwner.name}</p>
              <p style="margin-bottom: 0;"><strong>Email:</strong> ${hotelOwner.email}</p>
            </div>
            
            <div class="footer">
              <p>Please log in to your dashboard to approve or decline this reservation.</p>
              <p><em>This is an automated message. Please do not reply to this email.</em></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return this.reservationRepository.create(newReservation);
  }
}
