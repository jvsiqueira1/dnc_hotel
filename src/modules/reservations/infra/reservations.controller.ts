import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreateReservationDTO } from '../domain/dto/create-reservation.dto';
import { UpdateReservationStatusDTO } from '../domain/dto/update-reservation.dto';
import { CreateReservationService } from '../services/createReservation.service';
import { FindAllReservationsService } from '../services/findAllReservations.service';
import { FindByIdReservationsService } from '../services/findByIdReservations.service';
import { FindByUserReservationsService } from '../services/findByUserReservations.service';
import { UpdateStatusReservationsService } from '../services/updateStatusReservations.service';

@UseGuards(AuthGuard, RoleGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationsService: CreateReservationService,
    private readonly findAllReservationsService: FindAllReservationsService,
    private readonly findByIdReservationsService: FindByIdReservationsService,
    private readonly findByUserReservationsService: FindByUserReservationsService,
    private readonly updateStatusReservationsService: UpdateStatusReservationsService,
  ) {}

  @Roles(Role.USER)
  @Post()
  create(@User('id') id: number, @Body() body: CreateReservationDTO) {
    return this.createReservationsService.create(id, body);
  }

  @Get()
  findAll() {
    return this.findAllReservationsService.execute();
  }

  @Get('user')
  findByUser(@User('id') id: number) {
    return this.findByUserReservationsService.execute(id);
  }

  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findByIdReservationsService.execute(id);
  }

  @Patch(':id')
  updateStatus(
    @ParamId() id: number,
    @Body() body: UpdateReservationStatusDTO,
  ) {
    return this.updateStatusReservationsService.execute(id, body.status);
  }
}
