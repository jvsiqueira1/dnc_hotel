import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class authForgotPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
