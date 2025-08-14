import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../users/user.module';
import { HotelsController } from './infra/hotels.controller';
import { HotelsRepositories } from './infra/hotels.repository';
import { CreateHotelsService } from './services/createHotel.service';
import { FindAllHotelsService } from './services/findAllHotel.service';
import { FindByNameHotelService } from './services/findByNameHotel.service';
import { FindByOwnerHotelService } from './services/findByOwnerHotel.service';
import { FindOneHotelService } from './services/findOneHotel.service';
import { RemoveHotelService } from './services/removeHotel.service';
import { UpdateHotelsService } from './services/updateHotel.service';
import { HOTEL_REPOSITORY_TOKEN } from './utils/repositoriesTokens';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [HotelsController],
  providers: [
    CreateHotelsService,
    FindAllHotelsService,
    FindOneHotelService,
    FindByNameHotelService,
    FindByOwnerHotelService,
    UpdateHotelsService,
    RemoveHotelService,
    {
      provide: HOTEL_REPOSITORY_TOKEN,
      useClass: HotelsRepositories,
    },
  ],
})
export class HotelsModule {}
