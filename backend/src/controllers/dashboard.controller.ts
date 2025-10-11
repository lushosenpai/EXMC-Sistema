import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Ventas del día
    const todaySales = await prisma.sale.findMany({
      where: {
        createdAt: { gte: today },
        status: 'COMPLETADA',
      },
    });

    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayCount = todaySales.length;

    // Ventas del mes
    const monthSales = await prisma.sale.findMany({
      where: {
        createdAt: { gte: startOfMonth },
        status: 'COMPLETADA',
      },
    });

    const monthTotal = monthSales.reduce((sum, sale) => sum + sale.total, 0);
    const monthCount = monthSales.length;

    // Productos con stock bajo
    const lowStockProducts = await prisma.product.count({
      where: {
        isActive: true,
        stock: {
          lte: prisma.product.fields.minStock,
        },
      },
    });

    // Total de clientes activos
    const activeCustomers = await prisma.customer.count({
      where: { isActive: true },
    });

    // Ventas por método de pago (mes actual)
    const salesByPaymentMethod = await prisma.sale.groupBy({
      by: ['paymentMethod'],
      where: {
        createdAt: { gte: startOfMonth },
        status: 'COMPLETADA',
      },
      _sum: {
        total: true,
      },
      _count: true,
    });

    // Productos más vendidos (mes actual)
    const topProducts = await prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          createdAt: { gte: startOfMonth },
          status: 'COMPLETADA',
        },
      },
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    // Obtener detalles de productos más vendidos
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            code: true,
            image: true,
          },
        });
        return {
          ...product,
          totalQuantity: item._sum.quantity,
          totalRevenue: item._sum.subtotal,
        };
      })
    );

    // Ventas de los últimos 7 días
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const dailySales = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const sales = await prisma.sale.findMany({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay,
            },
            status: 'COMPLETADA',
          },
        });

        const total = sales.reduce((sum, sale) => sum + sale.total, 0);

        return {
          date: date.toISOString().split('T')[0],
          total,
          count: sales.length,
        };
      })
    );

    res.json({
      success: true,
      data: {
        today: {
          total: todayTotal,
          count: todayCount,
        },
        month: {
          total: monthTotal,
          count: monthCount,
        },
        lowStockProducts,
        activeCustomers,
        salesByPaymentMethod,
        topProducts: topProductsWithDetails,
        dailySales,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate, customerId, paymentMethod } = req.query;

    const where: any = {
      status: 'COMPLETADA',
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    const sales = await prisma.sale.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItems = sales.reduce(
      (sum, sale) => sum + sale.items.reduce((s, item) => s + item.quantity, 0),
      0
    );

    res.json({
      success: true,
      data: {
        sales,
        summary: {
          totalSales,
          totalRevenue: totalSales,
          totalItems,
          count: sales.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
