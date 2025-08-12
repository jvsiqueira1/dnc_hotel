import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

interface RequestWithUser {
  params: { id: string };
  user: { id: number };
}

@Injectable()
export class UserMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const id = request.params.id;
    const user = request.user;

    if (user.id !== Number(id))
      throw new UnauthorizedException(
        'You are not allowed to perform this operation',
      );

    return true;
  }
}
