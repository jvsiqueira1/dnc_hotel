import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { authForgotPasswordDTO } from './domain/dto/authForgotPassword.dto';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import { AuthRegisterDTO } from './domain/dto/authRegister.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Patch('reset-password')
  async reset(@Body() { token, password }: AuthResetPasswordDTO) {
    return this.authService.reset({ token, password });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: authForgotPasswordDTO) {
    return this.authService.forgot(email);
  }
}
