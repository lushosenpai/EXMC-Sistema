import { Response, NextFunction } from 'express';
import { PrismaClient, MovementType } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

// Obtener movimientos de stock
export const getStockMovements = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 50, productId, type } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (productId) where.productId = productId as string;
    if (type) where.type = type as MovementType;

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              code: true,
              stock: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.stockMovement.count({ where }),
    ]);

    res.json({
      success: true,
      data: movements,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Crear movimiento de stock (entrada, salida, ajuste)
export const createStockMovement = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, type, quantity, reason, reference } = req.body;

    if (!productId || !type || !quantity) {
      throw new ValidationError('Producto, tipo y cantidad son requeridos');
    }

    if (quantity <= 0) {
      throw new ValidationError('La cantidad debe ser mayor a 0');
    }

    if (!['ENTRADA', 'SALIDA', 'AJUSTE'].includes(type)) {
      throw new ValidationError('Tipo de movimiento inválido');
    }

    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Producto no encontrado');
    }

    // Calcular nuevo stock
    let newStock = product.stock;
    if (type === 'ENTRADA' || type === 'AJUSTE') {
      newStock = type === 'AJUSTE' ? Number(quantity) : product.stock + Number(quantity);
    } else if (type === 'SALIDA') {
      newStock = product.stock - Number(quantity);
      if (newStock < 0) {
        throw new ValidationError('No hay suficiente stock disponible');
      }
    }

    // Crear movimiento y actualizar stock en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const movement = await tx.stockMovement.create({
        data: {
          productId,
          type: type as MovementType,
          quantity: Number(quantity),
          previousStock: product.stock,
          newStock,
          reason,
          reference,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      return movement;
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener productos con stock bajo
export const getLowStockProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: {
          lte: prisma.product.fields.minStock,
        },
      },
      orderBy: {
        stock: 'asc',
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener historial de movimientos de un producto
export const getProductStockHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Producto no encontrado');
    }

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.stockMovement.count({
        where: { productId },
      }),
    ]);

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          name: product.name,
          code: product.code,
          currentStock: product.stock,
          minStock: product.minStock,
        },
        movements,
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
