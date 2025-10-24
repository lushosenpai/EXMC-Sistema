import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
  body: any;
  params: any;
  query: any;
  headers: any;
  file?: any;
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, name: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuario no válido');
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Token inválido'));
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expirado'));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('No tiene permisos para realizar esta acción');
    }

    next();
  };
};
