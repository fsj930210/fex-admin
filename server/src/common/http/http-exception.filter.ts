import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
} from '@nestjs/common'
import type { Response } from 'express'
import type { ResponseEnvelope } from './response-envelope.js'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const details = this.getDetails(exception)
    const body: ResponseEnvelope<unknown> = {
      code: status,
      message: details.message,
      data: details.data,
    }
    response.status(status).json(body)
  }

  private getDetails(exception: unknown): { message: string; data: unknown } {
    if (!(exception instanceof HttpException))
      return {
        message: exception instanceof Error ? exception.message : 'Internal server error.',
        data: null,
      }
    const response = exception.getResponse()
    if (typeof response === 'string') return { message: response, data: null }
    if (typeof response === 'object' && response !== null && 'message' in response) {
      const message = response.message
      return {
        message: Array.isArray(message) ? message.join('; ') : String(message),
        data: 'data' in response ? response.data : null,
      }
    }
    return { message: exception.message, data: null }
  }
}
