import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

@Injectable()
export class FileTypeValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithFile>();
    const file = request.file;

    if (file) {
      // Validar o tipo MIME do arquivo
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Tipo de arquivo não suportado. Tipos permitidos: ${allowedMimeTypes.join(', ')}`,
        );
      }

      // Log para debug
      console.log('=== FILE VALIDATION DEBUG ===');
      console.log('File mimetype:', file.mimetype);
      console.log('File originalname:', file.originalname);
      console.log('File size:', file.size);
      console.log('================================');
    }

    return next.handle();
  }
}
