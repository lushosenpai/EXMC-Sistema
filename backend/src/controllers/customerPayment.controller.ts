import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

// Obtener pagos de un cliente
export const getCustomerPayments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      prisma.customerPayment.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.customerPayment.count({
        where: { customerId },
      }),
    ]);

    res.json({
      success: true,
      data: payments,
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

// Crear un nuevo pago
export const createCustomerPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.params;
    const { amount, paymentMethod, reference, description } = req.body;

    if (!amount || amount <= 0) {
      throw new ValidationError('El monto debe ser mayor a 0');
    }

    if (!paymentMethod) {
      throw new ValidationError('El método de pago es requerido');
    }

    // Verificar que el cliente existe
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundError('Cliente no encontrado');
    }

    // Crear el pago y actualizar el balance del cliente en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.customerPayment.create({
        data: {
          customerId,
          amount: Number(amount),
          paymentMethod,
          reference,
          description,
          createdBy: req.user?.id,
        },
      });

      // Actualizar el balance del cliente (restar el pago)
      await tx.customer.update({
        where: { id: customerId },
        data: {
          currentBalance: {
            decrement: Number(amount),
          },
        },
      });

      return payment;
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un pago
export const deleteCustomerPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId, paymentId } = req.params;

    const payment = await prisma.customerPayment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundError('Pago no encontrado');
    }

    if (payment.customerId !== customerId) {
      throw new ValidationError('El pago no pertenece a este cliente');
    }

    // Eliminar el pago y restaurar el balance en una transacción
    await prisma.$transaction(async (tx) => {
      await tx.customerPayment.delete({
        where: { id: paymentId },
      });

      // Restaurar el balance (sumar el monto del pago eliminado)
      await tx.customer.update({
        where: { id: customerId },
        data: {
          currentBalance: {
            increment: payment.amount,
          },
        },
      });
    });

    res.json({
      success: true,
      message: 'Pago eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

// Obtener resumen de cuenta del cliente
export const getCustomerAccountSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        sales: {
          where: {
            paymentMethod: 'CUENTA_CORRIENTE',
            status: 'COMPLETADA',
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        accountPayments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!customer) {
      throw new NotFoundError('Cliente no encontrado');
    }

    // Calcular totales
    const totalSales = await prisma.sale.aggregate({
      where: {
        customerId,
        paymentMethod: 'CUENTA_CORRIENTE',
        status: 'COMPLETADA',
      },
      _sum: {
        total: true,
      },
    });

    const totalPayments = await prisma.customerPayment.aggregate({
      where: {
        customerId,
      },
      _sum: {
        amount: true,
      },
    });

    res.json({
      success: true,
      data: {
        customer: {
          id: customer.id,
          name: customer.name,
          accountType: customer.accountType,
          creditLimit: customer.creditLimit,
          currentBalance: customer.currentBalance,
        },
        summary: {
          totalSales: totalSales._sum.total || 0,
          totalPayments: totalPayments._sum.amount || 0,
          currentBalance: customer.currentBalance,
          availableCredit: customer.creditLimit - customer.currentBalance,
          creditUtilization: customer.creditLimit > 0 
            ? (customer.currentBalance / customer.creditLimit) * 100 
            : 0,
        },
        recentSales: customer.sales,
        recentPayments: customer.accountPayments,
      },
    });
  } catch (error) {
    next(error);
  }
};
