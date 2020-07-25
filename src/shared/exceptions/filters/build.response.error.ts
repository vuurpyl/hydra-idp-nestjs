import { Request } from 'express';
import { IResponseError } from './response.error';

export const buildResponseError: (statusCode: number, message: string, request: Request) => IResponseError = (
  statusCode: number,
  message: string,
  request: Request,
): IResponseError => {
  return {
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
  };
};
