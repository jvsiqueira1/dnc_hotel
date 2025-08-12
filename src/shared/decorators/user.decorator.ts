import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

interface RequestUser {
  [key: string]: unknown;
}

export const User = createParamDecorator(
  <T = RequestUser>(filter: string, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest<{ user: RequestUser }>();

    if (!user) throw new NotFoundException('User not found');

    if (filter) {
      if (!user[filter]) {
        throw new NotFoundException(`User ${filter} not found`);
      }

      return user[filter] as T;
    }

    return user;
  },
);
