import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'generated/prisma';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { OwnerHotelGuard } from 'src/shared/guards/ownerHotel.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreateHotelDTO } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDTO } from '../domain/dto/update-hotel.dto';
import { CreateHotelsService } from '../services/createHotel.service';
import { FindAllHotelsService } from '../services/findAllHotel.service';
import { FindByNameHotelService } from '../services/findByNameHotel.service';
import { FindByOwnerHotelService } from '../services/findByOwnerHotel.service';
import { FindOneHotelService } from '../services/findOneHotel.service';
import { RemoveHotelService } from '../services/removeHotel.service';
import { UpdateHotelsService } from '../services/updateHotel.service';

@UseGuards(AuthGuard, RoleGuard)
@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly createHotelService: CreateHotelsService,
    private readonly findAllHotelsService: FindAllHotelsService,
    private readonly findOneHotelService: FindOneHotelService,
    private readonly findByOwnerHotelService: FindByOwnerHotelService,
    private readonly findByNameHotelService: FindByNameHotelService,
    private readonly updateHotelService: UpdateHotelsService,
    private readonly removeHotelService: RemoveHotelService,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@User('id') id: number, @Body() createHotelDto: CreateHotelDTO) {
    return this.createHotelService.execute(createHotelDto, id);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.findAllHotelsService.execute(Number(page), Number(limit));
  }

  @Get('name')
  findByName(@Query('name') name: string) {
    return this.findByNameHotelService.execute(name);
  }

  @Roles(Role.ADMIN)
  @Get('owner')
  findByOwner(@User('id') id: number) {
    return this.findByOwnerHotelService.execute(id);
  }

  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findOneHotelService.execute(id);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@ParamId() id: number, @Body() updateHotelDto: UpdateHotelDTO) {
    return this.updateHotelService.execute(id, updateHotelDto);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@ParamId() id: number) {
    return this.removeHotelService.execute(id);
  }
}
