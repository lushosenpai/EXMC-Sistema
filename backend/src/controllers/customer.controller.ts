import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { ValidationError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

export const getCustomers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, search = '', accountType, isActive } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { cuitDni: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (accountType) {
      where.accountType = accountType;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { sales: true },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    res.json({
      success: true,
      data: customers,
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

export const getCustomerById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          select: {
            id: true,
            saleNumber: true,
            total: true,
            paymentMethod: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!customer) {
      throw new NotFoundError('Cliente no encontrado');
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      cuitDni,
      accountType,
      creditLimit,
      observations,
    } = req.body;

    if (!name) {
      throw new ValidationError('El nombre es requerido');
    }

    if (cuitDni) {
      const existing = await prisma.customer.findUnique({
        where: { cuitDni },
      });
      if (existing) {
        throw new ValidationError('Ya existe un cliente con ese CUIT/DNI');
      }
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email,
        address,
        cuitDni,
        accountType: accountType || 'EFECTIVO',
        creditLimit: parseFloat(creditLimit) || 0,
        observations,
      },
    });

    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      email,
      address,
      cuitDni,
      accountType,
      creditLimit,
      observations,
      isActive,
    } = req.body;

    if (cuitDni) {
      const existing = await prisma.customer.findFirst({
        where: {
          cuitDni,
          NOT: { id },
        },
      });
      if (existing) {
        throw new ValidationError('Ya existe un cliente con ese CUIT/DNI');
      }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        phone,
        email,
        address,
        cuitDni,
        accountType,
        creditLimit: parseFloat(creditLimit),
        observations,
        isActive,
      },
    });

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await prisma.customer.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// Get customer account summary (simplified version without CustomerPayment table)
export const getCustomerAccountSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            items: {
              include: {
                product: true,
              },
            },
            payments: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundError('Cliente no encontrado');
    }

    // Calculate totals from sales
    const totalSales = await prisma.sale.aggregate({
      where: {
        customerId: id,
        status: 'COMPLETADA',
      },
      _sum: {
        total: true,
      },
    });

    // Calculate total payments from sales (sum of all payment amounts)
    const salesWithPayments = await prisma.sale.findMany({
      where: {
        customerId: id,
        status: 'COMPLETADA',
      },
      include: {
        payments: true,
      },
    });

    const totalPayments = salesWithPayments.reduce((sum, sale) => {
      const salePayments = sale.payments.reduce((saleSum: number, payment) => saleSum + payment.amount, 0);
      return sum + salePayments;
    }, 0);

    const totalSalesAmount = totalSales._sum?.total || 0;
    const currentBalance = customer.currentBalance;
    const availableCredit = customer.creditLimit - currentBalance;
    const creditUtilization = customer.creditLimit > 0 
      ? (currentBalance / customer.creditLimit) * 100 
      : 0;

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
          totalSales: totalSalesAmount,
          totalPayments: totalPayments,
          currentBalance: currentBalance,
          availableCredit: availableCredit,
          creditUtilization: creditUtilization,
        },
        recentSales: customer.sales.map(sale => ({
          id: sale.id,
          date: sale.createdAt,
          total: sale.total,
          status: sale.status,
          items: sale.items.length,
        })),
        // Note: Detailed payment history requires CustomerPayment table
        // For now, we show payment info from sales (Payment model)
        recentPayments: salesWithPayments.slice(0, 10).flatMap(sale => 
          sale.payments.map(payment => ({
            id: payment.id,
            saleId: sale.id,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            reference: payment.reference,
            createdAt: sale.createdAt,
          }))
        ).slice(0, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};
