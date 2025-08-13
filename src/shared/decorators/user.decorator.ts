import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { User as UserType } from 'generated/prisma';

export const User = createParamDecorator(
  <T = UserType>(filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: UserType }>();
    const user = request.user;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (filter) {
      if (!user[filter]) {
        throw new NotFoundException(`User ${filter} not found`);
      }

      return user[filter] as T;
    }

    return user;
  },
);
