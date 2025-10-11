import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError, NotFoundError } from '../utils/errors';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Generar número de venta único
const generateSaleNumber = async (): Promise<string> => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const prefix = `V${year}${month}${day}`;
  
  const lastSale = await prisma.sale.findFirst({
    where: {
      saleNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      saleNumber: 'desc',
    },
  });

  let sequence = 1;
  if (lastSale) {
    const lastSequence = parseInt(lastSale.saleNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  return `${prefix}-${String(sequence).padStart(4, '0')}`;
};

export const getSales = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      customerId,
      paymentMethod,
      status,
      startDate,
      endDate,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (search) {
      where.saleNumber = {
        contains: search as string,
        mode: 'insensitive',
      };
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      }),
      prisma.sale.count({ where }),
    ]);

    res.json({
      success: true,
      data: sales,
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

export const getSaleById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!sale) {
      throw new NotFoundError('Venta no encontrada');
    }

    res.json({
      success: true,
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

export const createSale = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      customerId,
      items,
      subtotal,
      tax,
      discount,
      extraPercent,
      total,
      paymentMethod,
      observations,
    } = req.body;

    if (!items || items.length === 0) {
      throw new ValidationError('Debe agregar al menos un producto');
    }

    // Verificar stock de productos
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundError(`Producto ${item.productId} no encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new ValidationError(
          `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
        );
      }
    }

    // Generar número de venta
    const saleNumber = await generateSaleNumber();

    // Crear venta con items
    const sale = await prisma.sale.create({
      data: {
        saleNumber,
        customerId: customerId || null,
        userId: req.user!.id,
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax),
        discount: parseFloat(discount) || 0,
        extraPercent: parseFloat(extraPercent) || 0,
        total: parseFloat(total),
        paymentMethod,
        status: 'COMPLETADA',
        observations,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice),
            subtotal: parseFloat(item.subtotal),
          })),
        },
        payments: {
          create: {
            amount: parseFloat(total),
            paymentMethod,
          },
        },
      },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Descontar stock de productos
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      const newStock = product!.stock - item.quantity;

      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: newStock },
      });

      // Registrar movimiento de stock
      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          type: 'VENTA',
          quantity: item.quantity,
          previousStock: product!.stock,
          newStock,
          reason: `Venta ${saleNumber}`,
          reference: sale.id,
        },
      });
    }

    // Si es cuenta corriente, actualizar balance del cliente
    if (paymentMethod === 'CUENTA_CORRIENTE' && customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });

      await prisma.customer.update({
        where: { id: customerId },
        data: {
          currentBalance: customer!.currentBalance + parseFloat(total),
        },
      });
    }

    res.status(201).json({
      success: true,
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSale = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: true,
        customer: true,
      },
    });

    if (!sale) {
      throw new NotFoundError('Venta no encontrada');
    }

    if (sale.status === 'CANCELADA') {
      throw new ValidationError('La venta ya está cancelada');
    }

    // Devolver stock
    for (const item of sale.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      const newStock = product!.stock + item.quantity;

      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: newStock },
      });

      // Registrar movimiento
      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          type: 'ENTRADA',
          quantity: item.quantity,
          previousStock: product!.stock,
          newStock,
          reason: `Cancelación de venta ${sale.saleNumber}`,
          reference: sale.id,
        },
      });
    }

    // Si era cuenta corriente, ajustar balance
    if (sale.paymentMethod === 'CUENTA_CORRIENTE' && sale.customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: sale.customerId },
      });

      await prisma.customer.update({
        where: { id: sale.customerId },
        data: {
          currentBalance: customer!.currentBalance - sale.total,
        },
      });
    }

    // Actualizar estado de venta
    const updatedSale = await prisma.sale.update({
      where: { id },
      data: { status: 'CANCELADA' },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedSale,
    });
  } catch (error) {
    next(error);
  }
};

export const generateInvoicePDF = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        user: {
          select: {
            name: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      throw new NotFoundError('Venta no encontrada');
    }

    // Obtener configuración de empresa
    const config = await prisma.config.findMany();
    const configMap: Record<string, string> = {};
    config.forEach((c) => {
      configMap[c.key] = c.value;
    });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=factura-${sale.saleNumber}.pdf`
    );

    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text(configMap.COMPANY_NAME || 'EXMC', { align: 'center' });
    doc.fontSize(10).text(configMap.COMPANY_ADDRESS || '', { align: 'center' });
    doc.text(`Tel: ${configMap.COMPANY_PHONE || ''}`, { align: 'center' });
    doc.text(`CUIT: ${configMap.COMPANY_CUIT || ''}`, { align: 'center' });

    doc.moveDown(2);
    doc.fontSize(16).text(`FACTURA ${sale.saleNumber}`, { align: 'center' });
    doc.moveDown();

    // Información de venta
    doc.fontSize(10);
    doc.text(`Fecha: ${sale.createdAt.toLocaleDateString('es-AR')}`, 50, 200);
    doc.text(`Cliente: ${sale.customer?.name || 'Consumidor Final'}`, 50, 215);
    doc.text(`Vendedor: ${sale.user.name}`, 50, 230);
    doc.text(`Método de pago: ${sale.paymentMethod}`, 50, 245);

    // Tabla de productos
    doc.moveDown(3);
    const tableTop = 280;
    
    doc.font('Helvetica-Bold');
    doc.text('Producto', 50, tableTop);
    doc.text('Cant.', 250, tableTop);
    doc.text('P. Unit.', 320, tableTop);
    doc.text('Subtotal', 450, tableTop, { align: 'right' });

    doc.font('Helvetica');
    let yPosition = tableTop + 20;

    sale.items.forEach((item) => {
      doc.text(item.product.name, 50, yPosition, { width: 190 });
      doc.text(item.quantity.toString(), 250, yPosition);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 320, yPosition);
      doc.text(`$${item.subtotal.toFixed(2)}`, 450, yPosition, { align: 'right' });
      yPosition += 25;
    });

    // Totales
    yPosition += 20;
    doc.font('Helvetica-Bold');
    doc.text(`Subtotal:`, 350, yPosition);
    doc.text(`$${sale.subtotal.toFixed(2)}`, 450, yPosition, { align: 'right' });

    yPosition += 20;
    doc.text(`IVA:`, 350, yPosition);
    doc.text(`$${sale.tax.toFixed(2)}`, 450, yPosition, { align: 'right' });

    if (sale.discount > 0) {
      yPosition += 20;
      doc.text(`Descuento:`, 350, yPosition);
      doc.text(`-$${sale.discount.toFixed(2)}`, 450, yPosition, { align: 'right' });
    }

    if (sale.extraPercent > 0) {
      yPosition += 20;
      doc.text(`Recargo:`, 350, yPosition);
      doc.text(`$${(sale.total - sale.subtotal - sale.tax + sale.discount).toFixed(2)}`, 450, yPosition, { align: 'right' });
    }

    yPosition += 30;
    doc.fontSize(14);
    doc.text(`TOTAL:`, 350, yPosition);
    doc.text(`$${sale.total.toFixed(2)}`, 450, yPosition, { align: 'right' });

    // Observaciones
    if (sale.observations) {
      yPosition += 40;
      doc.fontSize(10);
      doc.font('Helvetica');
      doc.text(`Observaciones: ${sale.observations}`, 50, yPosition);
    }

    // Footer
    doc.fontSize(8);
    doc.text('Gracias por su compra', 50, 700, { align: 'center' });

    doc.end();
  } catch (error) {
    next(error);
  }
};
