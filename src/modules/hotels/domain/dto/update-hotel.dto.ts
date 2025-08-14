import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDTO } from './create-hotel.dto';

export class UpdateHotelDTO extends PartialType(CreateHotelDTO) {}
