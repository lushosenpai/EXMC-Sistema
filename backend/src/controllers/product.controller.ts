import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError, NotFoundError } from '../utils/errors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Configuración de Multer para subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/products');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
  },
});

export const getProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      supplierId,
      isActive,
      lowStock,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { code: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (lowStock === 'true') {
      where.stock = { lte: prisma.product.fields.minStock };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
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

export const getProductById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        supplier: true,
      },
    });

    if (!product) {
      throw new NotFoundError('Producto no encontrado');
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      code,
      supplierId,
      costPrice,
      salePrice,
      percentageEnabled,
      percentageValue,
      stock,
      minStock,
      description,
    } = req.body;

    if (!name || !code) {
      throw new ValidationError('Nombre y código son requeridos');
    }

    const existingProduct = await prisma.product.findUnique({
      where: { code },
    });

    if (existingProduct) {
      throw new ValidationError('Ya existe un producto con ese código');
    }

    const image = req.file ? `/uploads/products/${req.file.filename}` : null;

    const product = await prisma.product.create({
      data: {
        name,
        code,
        supplierId: supplierId || null,
        costPrice: parseFloat(costPrice) || 0,
        salePrice: parseFloat(salePrice) || 0,
        percentageEnabled: percentageEnabled === 'true',
        percentageValue: parseFloat(percentageValue) || 0,
        image,
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 5,
        description,
      },
      include: {
        supplier: true,
      },
    });

    // Registrar movimiento de stock inicial
    if (product.stock > 0) {
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: 'ENTRADA',
          quantity: product.stock,
          previousStock: 0,
          newStock: product.stock,
          reason: 'Stock inicial',
        },
      });
    }

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      supplierId,
      costPrice,
      salePrice,
      percentageEnabled,
      percentageValue,
      stock,
      minStock,
      description,
      isActive,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundError('Producto no encontrado');
    }

    if (code && code !== existingProduct.code) {
      const codeExists = await prisma.product.findUnique({
        where: { code },
      });
      if (codeExists) {
        throw new ValidationError('Ya existe un producto con ese código');
      }
    }

    let image = existingProduct.image;
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (existingProduct.image) {
        const oldImagePath = path.join(__dirname, '../..', existingProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/products/${req.file.filename}`;
    }

    const updateData: any = {
      name,
      code,
      supplierId: supplierId || null,
      costPrice: parseFloat(costPrice),
      salePrice: parseFloat(salePrice),
      percentageEnabled: percentageEnabled === 'true',
      percentageValue: parseFloat(percentageValue) || 0,
      minStock: parseInt(minStock),
      description,
      image,
    };

    if (isActive !== undefined) {
      updateData.isActive = isActive === 'true';
    }

    // Manejar cambios de stock
    const newStock = parseInt(stock);
    if (!isNaN(newStock) && newStock !== existingProduct.stock) {
      const difference = newStock - existingProduct.stock;
      updateData.stock = newStock;

      // Registrar movimiento de stock
      await prisma.stockMovement.create({
        data: {
          productId: id,
          type: difference > 0 ? 'ENTRADA' : 'AJUSTE',
          quantity: Math.abs(difference),
          previousStock: existingProduct.stock,
          newStock: newStock,
          reason: 'Ajuste manual',
        },
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        supplier: true,
      },
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError('Producto no encontrado');
    }

    // Eliminar imagen si existe
    if (product.image) {
      const imagePath = path.join(__dirname, '../..', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

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
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { stock: 'asc' },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
