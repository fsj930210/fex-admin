import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { map, type Observable } from 'rxjs';
import type { ResponseEnvelope } from './response-envelope.js';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseEnvelope<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseEnvelope<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => ({
        code: response.statusCode,
        message: 'success',
        data,
      })),
    );
  }
}
