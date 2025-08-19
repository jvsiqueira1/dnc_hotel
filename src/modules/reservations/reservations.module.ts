import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelsRepositories } from '../hotels/infra/hotels.repository';
import { HOTEL_REPOSITORY_TOKEN } from '../hotels/utils/repositoriesTokens';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../users/user.module';
import { ReservationsController } from './infra/reservations.controller';
import { ReservationRepository } from './infra/reservations.repository';
import { CreateReservationService } from './services/createReservation.service';
import { FindAllReservationsService } from './services/findAllReservations.service';
import { FindByIdReservationsService } from './services/findByIdReservations.service';
import { FindByUserReservationsService } from './services/findByUserReservations.service';
import { UpdateStatusReservationsService } from './services/updateStatusReservations.service';
import { RESERVATIONS_REPOSITORY_TOKEN } from './utils/repositoriesToken';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, HotelsModule],
  controllers: [ReservationsController],
  providers: [
    CreateReservationService,
    FindAllReservationsService,
    FindByIdReservationsService,
    FindByUserReservationsService,
    UpdateStatusReservationsService,
    {
      provide: RESERVATIONS_REPOSITORY_TOKEN,
      useClass: ReservationRepository,
    },
    {
      provide: HOTEL_REPOSITORY_TOKEN,
      useClass: HotelsRepositories,
    },
  ],
})
export class ReservationsModule {}
