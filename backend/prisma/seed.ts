import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Limpiar datos existentes
  await prisma.saleItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.config.deleteMany();

  // Crear usuarios
  console.log('👥 Creando usuarios...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const hashedPasswordVendedor = await bcrypt.hash('vendedor123', 10);
  const hashedPasswordConsulta = await bcrypt.hash('consulta123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@exmc.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'vendedor@exmc.com',
      password: hashedPasswordVendedor,
      name: 'Juan Vendedor',
      role: 'VENDEDOR',
    },
  });

  await prisma.user.create({
    data: {
      email: 'consulta@exmc.com',
      password: hashedPasswordConsulta,
      name: 'María Consulta',
      role: 'CONSULTA',
    },
  });

  console.log('✅ Usuarios creados');

  // Crear proveedores
  console.log('🏢 Creando proveedores...');
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Distribuidora Belleza SA',
      phone: '+54 11 4567-8900',
      email: 'ventas@belleza.com',
      address: 'Av. Corrientes 1234',
      city: 'Buenos Aires',
      province: 'CABA',
      observations: 'Proveedor principal de productos de peluquería',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Cosméticos del Sur',
      phone: '+54 11 4444-5555',
      email: 'info@cosmeticosdelsur.com',
      address: 'Calle Falsa 456',
      city: 'Rosario',
      province: 'Santa Fe',
    },
  });

  const supplier3 = await prisma.supplier.create({
    data: {
      name: 'Importadora Style',
      phone: '+54 341 555-7788',
      email: 'contacto@importadorastyle.com',
      address: 'Bv. Oroño 789',
      city: 'Rosario',
      province: 'Santa Fe',
      observations: 'Productos importados de alta gama',
    },
  });

  console.log('✅ Proveedores creados');

  // Crear productos
  console.log('📦 Creando productos...');
  const products = [
    {
      name: 'Shampoo Keratina 500ml',
      code: 'SHP-001',
      supplierId: supplier1.id,
      costPrice: 1200,
      salePrice: 2400,
      stock: 50,
      minStock: 10,
      description: 'Shampoo con keratina para cabello maltratado',
      percentageEnabled: true,
      percentageValue: 100,
    },
    {
      name: 'Acondicionador Hidratante 500ml',
      code: 'ACD-001',
      supplierId: supplier1.id,
      costPrice: 1300,
      salePrice: 2600,
      stock: 45,
      minStock: 10,
      description: 'Acondicionador con aceites naturales',
      percentageEnabled: true,
      percentageValue: 100,
    },
    {
      name: 'Tintura Castaño Claro',
      code: 'TIN-001',
      supplierId: supplier2.id,
      costPrice: 800,
      salePrice: 1800,
      stock: 30,
      minStock: 5,
      description: 'Tintura permanente sin amoníaco',
    },
    {
      name: 'Tintura Rubio Natural',
      code: 'TIN-002',
      supplierId: supplier2.id,
      costPrice: 800,
      salePrice: 1800,
      stock: 25,
      minStock: 5,
    },
    {
      name: 'Crema de Peinar Rizos Definidos',
      code: 'CRP-001',
      supplierId: supplier1.id,
      costPrice: 950,
      salePrice: 2100,
      stock: 40,
      minStock: 8,
      description: 'Crema para definir y controlar el frizz',
      percentageEnabled: true,
      percentageValue: 120,
    },
    {
      name: 'Plancha de Cabello Profesional',
      code: 'PLA-001',
      supplierId: supplier3.id,
      costPrice: 8500,
      salePrice: 15000,
      stock: 8,
      minStock: 2,
      description: 'Plancha de cerámica con control de temperatura',
    },
    {
      name: 'Secador de Pelo 2000W',
      code: 'SEC-001',
      supplierId: supplier3.id,
      costPrice: 6200,
      salePrice: 11500,
      stock: 12,
      minStock: 3,
      description: 'Secador profesional con tecnología iónica',
    },
    {
      name: 'Máscara Reparadora Intensiva',
      code: 'MAS-001',
      supplierId: supplier1.id,
      costPrice: 1800,
      salePrice: 3600,
      stock: 35,
      minStock: 10,
      description: 'Tratamiento intensivo para cabello dañado',
      percentageEnabled: true,
      percentageValue: 100,
    },
    {
      name: 'Spray Fijador Extra Fuerte',
      code: 'SPR-001',
      supplierId: supplier2.id,
      costPrice: 650,
      salePrice: 1400,
      stock: 60,
      minStock: 15,
    },
    {
      name: 'Aceite de Argán 100ml',
      code: 'ACE-001',
      supplierId: supplier1.id,
      costPrice: 2200,
      salePrice: 4500,
      stock: 20,
      minStock: 5,
      description: 'Aceite puro de argán para tratamiento capilar',
    },
    {
      name: 'Cepillo Térmico Profesional',
      code: 'CEP-001',
      supplierId: supplier3.id,
      costPrice: 1500,
      salePrice: 3200,
      stock: 15,
      minStock: 5,
    },
    {
      name: 'Gel Modelador Extra Hold',
      code: 'GEL-001',
      supplierId: supplier2.id,
      costPrice: 580,
      salePrice: 1200,
      stock: 48,
      minStock: 10,
    },
    {
      name: 'Decolorante Polvo Azul 500g',
      code: 'DEC-001',
      supplierId: supplier2.id,
      costPrice: 1400,
      salePrice: 2900,
      stock: 22,
      minStock: 5,
    },
    {
      name: 'Oxidante 30 Vol 1L',
      code: 'OXI-001',
      supplierId: supplier2.id,
      costPrice: 450,
      salePrice: 1000,
      stock: 55,
      minStock: 12,
    },
    {
      name: 'Tratamiento Botox Capilar',
      code: 'BOT-001',
      supplierId: supplier3.id,
      costPrice: 3500,
      salePrice: 7200,
      stock: 10,
      minStock: 3,
      description: 'Tratamiento profesional de alisado',
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Productos creados');

  // Crear clientes
  console.log('👥 Creando clientes...');
  const customers = [
    {
      name: 'Ana García Pérez',
      phone: '+54 9 341 555-1234',
      email: 'ana.garcia@email.com',
      address: 'Calle San Martín 456',
      cuitDni: '27345678901',
      accountType: 'EFECTIVO',
    },
    {
      name: 'Carlos Rodríguez',
      phone: '+54 9 341 555-5678',
      email: 'carlos.rodriguez@email.com',
      address: 'Av. Pellegrini 1234',
      cuitDni: '20234567890',
      accountType: 'CUENTA_CORRIENTE',
      creditLimit: 50000,
      currentBalance: 0,
    },
    {
      name: 'María Fernández',
      phone: '+54 9 341 555-9012',
      email: 'maria.fernandez@email.com',
      address: 'Bv. Rondeau 789',
      cuitDni: '27456789012',
      accountType: 'EFECTIVO',
    },
    {
      name: 'Peluquería Estilo & Moda',
      phone: '+54 341 444-7788',
      email: 'estilomoda@peluqueria.com',
      address: 'Calle Córdoba 2345',
      cuitDni: '30712345678',
      accountType: 'CUENTA_CORRIENTE',
      creditLimit: 100000,
      currentBalance: 0,
      observations: 'Cliente mayorista - Descuento del 10%',
    },
    {
      name: 'Laura Martínez',
      phone: '+54 9 341 555-3344',
      email: 'laura.martinez@email.com',
      address: 'Calle Entre Ríos 567',
      cuitDni: '27567890123',
      accountType: 'EFECTIVO',
    },
  ];

  for (const customer of customers) {
    await prisma.customer.create({ data: customer });
  }

  console.log('✅ Clientes creados');

  // Crear configuración
  console.log('⚙️ Creando configuración...');
  await prisma.config.createMany({
    data: [
      { key: 'TAX_RATE', value: '21' }, // IVA 21%
      { key: 'COMPANY_NAME', value: 'EXMC - Gestión Comercial' },
      { key: 'COMPANY_ADDRESS', value: 'Av. Principal 1234, Rosario' },
      { key: 'COMPANY_PHONE', value: '+54 341 555-0000' },
      { key: 'COMPANY_EMAIL', value: 'info@exmc.com' },
      { key: 'COMPANY_CUIT', value: '30-12345678-9' },
    ],
  });

  console.log('✅ Configuración creada');

  console.log('');
  console.log('✨ Seed completado exitosamente!');
  console.log('');
  console.log('📝 Credenciales de acceso:');
  console.log('  Admin:    admin@exmc.com / admin123');
  console.log('  Vendedor: vendedor@exmc.com / vendedor123');
  console.log('  Consulta: consulta@exmc.com / consulta123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
