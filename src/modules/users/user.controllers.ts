import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Role, type User as UserType } from 'generated/prisma';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { UserMatchGuard } from 'src/shared/guards/userMatch.guard';
import { FileTypeValidationInterceptor } from 'src/shared/interceptors/fileTypeValidation.interceptor';
import { FileValidationInterceptor } from 'src/shared/interceptors/fileValidation.interceptor';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import { UserService } from './user.services';

@UseGuards(AuthGuard, RoleGuard, ThrottlerGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  list(@User() user: UserType) {
    console.log(user);
    return this.userService.list();
  }

  @Get(':id')
  show(@ParamId() id: number) {
    return this.userService.show(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  createUser(@Body() body: CreateUserDTO) {
    return this.userService.create(body);
  }

  @UseGuards(UserMatchGuard)
  @Roles()
  @Patch(':id')
  updateUser(@ParamId() id: number, @Body() body: UpdateUserDTO) {
    return this.userService.update(id, body);
  }

  @UseGuards(UserMatchGuard)
  @Delete(':id')
  @HttpCode(204)
  deleteUser(@ParamId() id: number) {
    return this.userService.delete(id);
  }

  @UseInterceptors(
    FileInterceptor('avatar'),
    FileValidationInterceptor,
    FileTypeValidationInterceptor,
  )
  @Post('avatar')
  uploadAvatar(
    @User('id') id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024,
          }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(id, avatar.filename);
  }
}
