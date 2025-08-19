import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
import { UserService } from 'src/modules/users/user.services';
import type { IReservationsRepository } from '../domain/repositories/IReservations.repository';
import { RESERVATIONS_REPOSITORY_TOKEN } from '../utils/repositoriesToken';

@Injectable()
export class UpdateStatusReservationsService {
  constructor(
    @Inject(RESERVATIONS_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationsRepository,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async execute(id: number, status: ReservationStatus) {
    const reservation = await this.reservationRepository.updateStatus(
      id,
      status,
    );

    const user = await this.userService.show(reservation.userId);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reservation Status Updated',
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reservation Status Updated</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .status-card { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0; }
          .status-badge { padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
          .status-confirmed { background-color: #d4edda; color: #155724; }
          .status-pending { background-color: #fff3cd; color: #856404; }
          .status-cancelled { background-color: #e2e3e5; color: #383d41; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #555; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0;">🏨 Reservation Update</h1>
          <p style="margin: 10px 0 0 0;">Status Changed</p>
        </div>
        
        <div class="content">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We're writing to inform you that your reservation status has been updated.</p>
          
          <div class="status-card">
            <h3 style="margin-top: 0; color: #2c3e50;">📋 Reservation Status</h3>
            <div style="text-align: center; margin: 20px 0;">
              <span class="status-badge status-${status.toLowerCase()}">${status}</span>
            </div>
            
            <h4 style="color: #2c3e50; margin-top: 25px;">📍 Reservation Details</h4>
            
            <div class="detail-row">
              <span class="detail-label">🏨 Hotel:</span>
              <span class="detail-value">${reservation.hotelId}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📅 Check-in:</span>
              <span class="detail-value">${new Date(reservation.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">📅 Check-out:</span>
              <span class="detail-value">${new Date(reservation.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <div class="detail-row" style="border-bottom: none;">
              <span class="detail-label">💰 Total Amount:</span>
              <span class="detail-value" style="font-weight: bold; color: #27ae60;">$${reservation.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>If you have any questions about this update, please don't hesitate to contact us.</p>
            <p><em>This is an automated message. Please do not reply to this email.</em></p>
          </div>
        </div>
      </body>
      </html>
      `,
    });

    return reservation;
  }
}
