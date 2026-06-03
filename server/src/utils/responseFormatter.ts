import { ApiResponse } from '../types';

export function successResponse<T>(data: T, message?: string, meta?: ApiResponse['meta']): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  };
}

export function errorResponse(message: string): ApiResponse {
  return {
    success: false,
    message,
  };
}
