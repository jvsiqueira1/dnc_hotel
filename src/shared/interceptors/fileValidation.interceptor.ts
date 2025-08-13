import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { unlink } from 'fs';
import { catchError, Observable, throwError } from 'rxjs';

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof BadGatewayException) {
          const request = context.switchToHttp().getRequest<RequestWithFile>();
          const file = request.file;
          if (file) {
            unlink(file.path, (unlinkErr) => {
              if (unlinkErr) console.error('Error removing file', unlinkErr);
            });
          }
        }
        return throwError(() => err as Error);
      }),
    );
  }
}
