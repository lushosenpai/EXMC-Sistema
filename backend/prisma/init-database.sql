-- Script de inicialización de base de datos SQLite
-- Este script crea todas las tablas necesarias para el sistema EXMC

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VENDEDOR',
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS "suppliers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "province" TEXT,
    "observations" TEXT,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL UNIQUE,
    "supplierId" TEXT,
    "costPrice" REAL NOT NULL,
    "salePrice" REAL NOT NULL,
    "percentageEnabled" INTEGER NOT NULL DEFAULT 0,
    "percentageValue" REAL NOT NULL DEFAULT 0,
    "image" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 5,
    "description" TEXT,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS "customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "cuitDni" TEXT UNIQUE,
    "accountType" TEXT NOT NULL DEFAULT 'EFECTIVO',
    "creditLimit" REAL NOT NULL DEFAULT 0,
    "currentBalance" REAL NOT NULL DEFAULT 0,
    "observations" TEXT,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Tabla de Pagos de Cuenta Corriente
CREATE TABLE IF NOT EXISTS "customer_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "reference" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de Ventas
CREATE TABLE IF NOT EXISTS "sales" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "saleNumber" TEXT NOT NULL UNIQUE,
    "customerId" TEXT,
    "userId" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "extraPercent" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "paymentMethod" TEXT,
    "amountPaid" REAL,
    "change" REAL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETADA',
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON UPDATE CASCADE
);

-- Tabla de Items de Venta
CREATE TABLE IF NOT EXISTS "sale_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "saleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON UPDATE CASCADE
);

-- Tabla de Pagos
CREATE TABLE IF NOT EXISTS "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "saleId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "reference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de Movimientos de Stock
CREATE TABLE IF NOT EXISTS "stock_movements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "reason" TEXT,
    "reference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de Configuración
CREATE TABLE IF NOT EXISTS "config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS "idx_products_code" ON "products"("code");
CREATE INDEX IF NOT EXISTS "idx_products_supplierId" ON "products"("supplierId");
CREATE INDEX IF NOT EXISTS "idx_customers_cuitDni" ON "customers"("cuitDni");
CREATE INDEX IF NOT EXISTS "idx_sales_saleNumber" ON "sales"("saleNumber");
CREATE INDEX IF NOT EXISTS "idx_sales_customerId" ON "sales"("customerId");
CREATE INDEX IF NOT EXISTS "idx_sales_userId" ON "sales"("userId");
CREATE INDEX IF NOT EXISTS "idx_sale_items_saleId" ON "sale_items"("saleId");
CREATE INDEX IF NOT EXISTS "idx_sale_items_productId" ON "sale_items"("productId");
CREATE INDEX IF NOT EXISTS "idx_payments_saleId" ON "payments"("saleId");
CREATE INDEX IF NOT EXISTS "idx_customer_payments_customerId" ON "customer_payments"("customerId");
CREATE INDEX IF NOT EXISTS "idx_stock_movements_productId" ON "stock_movements"("productId");

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (hash bcrypt)
INSERT OR IGNORE INTO "users" ("id", "email", "password", "name", "role", "isActive", "createdAt", "updatedAt")
VALUES (
    'admin-' || hex(randomblob(16)),
    'admin@exmc.com',
    '$2b$10$rQ3FG7zQKx4uFY8N3L5oZ.7KZJ5Gw6UpXPxqHhFz9oGVU5xYQZGZS',
    'Administrador',
    'ADMIN',
    1,
    datetime('now'),
    datetime('now')
);

-- Insertar configuraciones por defecto
INSERT OR IGNORE INTO "config" ("id", "key", "value", "createdAt", "updatedAt")
VALUES 
    ('config-' || hex(randomblob(16)), 'business_name', 'Mi Negocio', datetime('now'), datetime('now')),
    ('config-' || hex(randomblob(16)), 'business_address', '', datetime('now'), datetime('now')),
    ('config-' || hex(randomblob(16)), 'business_phone', '', datetime('now'), datetime('now')),
    ('config-' || hex(randomblob(16)), 'business_email', '', datetime('now'), datetime('now')),
    ('config-' || hex(randomblob(16)), 'tax_percentage', '21', datetime('now'), datetime('now'));
