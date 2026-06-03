import { Request, Response, NextFunction } from 'express';
import { AppError } from '../services/leadService';
import { errorResponse } from '../utils/responseFormatter';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[Error] ${err.name}: ${err.message}`);

  // Custom application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message));
    return;
  }

  // Prisma unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      res.status(409).json(errorResponse(`A record with this ${field} already exists`));
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json(errorResponse('Record not found'));
      return;
    }
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json(errorResponse('Invalid request data'));
    return;
  }

  // Default server error
  res.status(500).json(
    errorResponse(
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
    )
  );
}
