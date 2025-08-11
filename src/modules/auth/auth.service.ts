/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role, User } from 'generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from '../users/domain/dto/createUser.dto';
import { UserService } from '../users/user.services';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import { AuthRegisterDTO } from './domain/dto/authRegister.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';
import { ValidateTokenDTO } from './domain/dto/validateToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async generateJwtToken(user: User, expiresIn: string = '1d') {
    const payload = { sub: user.id, name: user.name };
    const options = {
      expiresIn: expiresIn,
      issuer: 'dnc_hotel',
      audience: 'users',
    };

    return { access_token: await this.jwtService.signAsync(payload, options) };
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateJwtToken(user);
  }

  async register(body: AuthRegisterDTO) {
    const newUser: CreateUserDTO = {
      email: body.email ?? '',
      name: body.name ?? '',
      password: body.password ?? '',
      role: body.role ?? Role.USER,
    };

    const user = await this.userService.create(newUser);

    return await this.generateJwtToken(user);
  }

  async reset({ token, password }: AuthResetPasswordDTO) {
    const { valid, decoded } = await this.validateToken(token);

    if (!valid) throw new UnauthorizedException('Invalid token');

    const user = await this.userService.update(Number(decoded?.sub), {
      password,
    });

    return await this.generateJwtToken(user);
  }

  async forgot(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Email is incorrect');

    const token = await this.generateJwtToken(user, '30m');

    return token;
  }

  private async validateToken(token: string): Promise<ValidateTokenDTO> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        audience: 'users',
        issuer: 'dnc_hotel',
      });

      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }
}
