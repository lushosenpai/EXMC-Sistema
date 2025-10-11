import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export const getSuppliers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, search = '', isActive } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.supplier.count({ where }),
    ]);

    res.json({
      success: true,
      data: suppliers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSupplierById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            code: true,
            stock: true,
            salePrice: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundError('Proveedor no encontrado');
    }

    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, phone, email, address, city, province, observations } = req.body;

    if (!name) {
      throw new ValidationError('El nombre es requerido');
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        phone,
        email,
        address,
        city,
        province,
        observations,
      },
    });

    res.status(201).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, city, province, observations, isActive } =
      req.body;

    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        phone,
        email,
        address,
        city,
        province,
        observations,
        isActive,
      },
    });

    res.json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await prisma.supplier.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Proveedor eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
