import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  BadRequestException,
  Logger,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { buildResponseError } from './build.response.error';

@Catch(BadRequestException)
export class ResourceNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    Logger.error(message, exception.stack, `${request.method} ${request.url}`);

    response.status(status).json(buildResponseError(HttpStatus.NOT_FOUND, message, request));
  }
}
