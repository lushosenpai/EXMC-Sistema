import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getConfig = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = await prisma.config.findMany();
    
    const configMap: Record<string, string> = {};
    config.forEach((item) => {
      configMap[item.key] = item.value;
    });

    res.json({
      success: true,
      data: configMap,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConfig = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key, value } = req.body;

    const config = await prisma.config.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};
