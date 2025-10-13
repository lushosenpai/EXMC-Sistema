-- ============================================
-- SEED COMPLETO: TIENDA DE ROPA "EXMC"
-- ============================================

-- 1. USUARIOS (admin + vendedor + consulta)
INSERT INTO users (id, email, password, name, role, "isActive", "createdAt", "updatedAt")
VALUES 
  ('admin-001', 'admin@exmc.com', '$2b$10$dm.tU0jQUVn6BmNiRAcggOwfngqi8UTBIBcocEvBKS.5jC/zvh89S', 'Administrador', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vendedor-001', 'vendedor@exmc.com', '$2b$10$dm.tU0jQUVn6BmNiRAcggOwfngqi8UTBIBcocEvBKS.5jC/zvh89S', 'María González', 'VENDEDOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('consulta-001', 'consulta@exmc.com', '$2b$10$dm.tU0jQUVn6BmNiRAcggOwfngqi8UTBIBcocEvBKS.5jC/zvh89S', 'Pedro Ramírez', 'CONSULTA', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 2. PROVEEDORES
INSERT INTO suppliers (id, name, phone, email, address, city, province, observations, "isActive", "createdAt", "updatedAt")
VALUES 
  ('supplier-001', 'Textiles del Norte', '2615551234', 'ventas@textilesdelnorte.com', 'Av. San Martín 1234', 'Mendoza', 'Mendoza', 'Proveedor principal de jeans y pantalones', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('supplier-002', 'Modas Argentinas SA', '1145678901', 'contacto@modasargentinas.com', 'Av. Corrientes 5678', 'Buenos Aires', 'Buenos Aires', 'Ropa de mujer, vestidos y blusas', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('supplier-003', 'Sport Fashion', '3514445566', 'info@sportfashion.com', 'Calle 27 de Abril 890', 'Córdoba', 'Córdoba', 'Ropa deportiva y casual', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('supplier-004', 'Calzados Premium', '2214567890', 'ventas@calzadospremium.com', 'Calle 50 N° 456', 'La Plata', 'Buenos Aires', 'Zapatos, zapatillas y accesorios', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 3. PRODUCTOS (Ropa y accesorios)
INSERT INTO products (id, name, code, "supplierId", "costPrice", "salePrice", "percentageEnabled", "percentageValue", stock, "minStock", description, "isActive", "createdAt", "updatedAt")
VALUES 
  -- Jeans
  ('prod-001', 'Jean Clásico Azul Mujer', 'JEAN-001', 'supplier-001', 8500, 15000, false, 0, 25, 5, 'Jean clásico tiro medio, corte recto, 100% algodón', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-002', 'Jean Skinny Negro Mujer', 'JEAN-002', 'supplier-001', 9000, 16500, false, 0, 18, 5, 'Jean skinny tiro alto, elastizado, color negro', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-003', 'Jean Relaxed Hombre', 'JEAN-003', 'supplier-001', 9500, 17000, false, 0, 15, 5, 'Jean relaxed fit, tiro medio, color azul oscuro', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Remeras
  ('prod-004', 'Remera Básica Blanca', 'REM-001', 'supplier-003', 2500, 5500, false, 0, 50, 10, 'Remera básica manga corta, 100% algodón, talle único', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-005', 'Remera Estampada Mujer', 'REM-002', 'supplier-002', 3200, 6800, false, 0, 30, 10, 'Remera estampada manga corta, diseño floral', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-006', 'Remera Deportiva Dry Fit', 'REM-003', 'supplier-003', 4000, 8500, false, 0, 22, 8, 'Remera deportiva tecnología dry-fit, varios colores', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Vestidos
  ('prod-007', 'Vestido Largo Floreado', 'VEST-001', 'supplier-002', 12000, 22000, false, 0, 12, 3, 'Vestido largo estampado floral, ideal verano', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-008', 'Vestido Corto Negro Elegante', 'VEST-002', 'supplier-002', 10500, 19500, false, 0, 8, 3, 'Vestido corto elegante, ideal eventos', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Pantalones
  ('prod-009', 'Pantalón Chino Beige Hombre', 'PANT-001', 'supplier-001', 7500, 14000, false, 0, 20, 5, 'Pantalón chino corte clásico, color beige', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-010', 'Pantalón Jogger Negro', 'PANT-002', 'supplier-003', 6800, 13500, false, 0, 25, 8, 'Pantalón jogger deportivo, tela frizada', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Buzos y Camperas
  ('prod-011', 'Buzo Canguro Gris', 'BUZO-001', 'supplier-003', 8500, 16000, false, 0, 15, 5, 'Buzo canguro con capucha, algodón frizado', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-012', 'Campera Jean Clásica', 'CAMP-001', 'supplier-001', 15000, 28000, false, 0, 10, 3, 'Campera de jean clásica, forro interno', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-013', 'Campera Inflable Negra', 'CAMP-002', 'supplier-003', 18000, 32000, false, 0, 8, 2, 'Campera inflable con capucha desmontable', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Calzado
  ('prod-014', 'Zapatillas Deportivas Blancas', 'ZAP-001', 'supplier-004', 12000, 22000, false, 0, 30, 8, 'Zapatillas deportivas urbanas, color blanco', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-015', 'Zapatillas Running Negras', 'ZAP-002', 'supplier-004', 15000, 27000, false, 0, 18, 5, 'Zapatillas para running, suela deportiva', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-016', 'Botas Texanas Marrón', 'BOT-001', 'supplier-004', 20000, 35000, false, 0, 12, 3, 'Botas texanas cuero vacuno, color marrón', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Accesorios
  ('prod-017', 'Cinturón Cuero Negro', 'ACC-001', 'supplier-004', 3500, 7000, false, 0, 25, 8, 'Cinturón de cuero genuino, hebilla metálica', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-018', 'Gorra Deportiva', 'ACC-002', 'supplier-003', 2200, 5000, false, 0, 40, 10, 'Gorra deportiva ajustable, varios colores', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-019', 'Cartera Bandolera Mujer', 'ACC-003', 'supplier-002', 8500, 16000, false, 0, 15, 5, 'Cartera bandolera eco-cuero, varios colores', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod-020', 'Bufanda de Lana', 'ACC-004', 'supplier-002', 3000, 6500, false, 0, 20, 8, 'Bufanda tejida de lana, ideal invierno', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

-- 4. CLIENTES
INSERT INTO customers (id, name, phone, email, address, "cuitDni", "accountType", "creditLimit", "currentBalance", observations, "isActive", "createdAt", "updatedAt")
VALUES 
  ('customer-001', 'Ana Martínez', '2615001122', 'ana.martinez@email.com', 'Calle Las Heras 456', '27123456789', 'EFECTIVO', 0, 0, 'Cliente frecuente, compra mayoreo', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('customer-002', 'Carlos Rodríguez', '2615002233', 'carlos.rodriguez@email.com', 'Av. San Martín 789', '20234567890', 'CUENTA_CORRIENTE', 50000, 0, 'Comerciante con cuenta corriente', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('customer-003', 'Laura Fernández', '2615003344', 'laura.fernandez@email.com', 'Calle Belgrano 123', '27345678901', 'EFECTIVO', 0, 0, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('customer-004', 'Miguel Ángel Sosa', '2615004455', 'miguel.sosa@email.com', 'Calle 9 de Julio 567', '20456789012', 'CUENTA_CORRIENTE', 30000, 0, 'Boutique del centro', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('customer-005', 'Gabriela Pérez', '2615005566', 'gabriela.perez@email.com', 'Av. Libertador 890', '27567890123', 'EFECTIVO', 0, 0, 'Compra esporádicamente', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('customer-006', 'Consumidor Final', NULL, NULL, NULL, NULL, 'EFECTIVO', 0, 0, 'Cliente genérico para ventas sin datos', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("cuitDni") DO NOTHING;

-- 5. VENTAS DE EJEMPLO (últimos 7 días)
INSERT INTO sales (id, "saleNumber", "customerId", "userId", subtotal, tax, discount, "extraPercent", total, "paymentMethod", "amountPaid", change, status, observations, "createdAt", "updatedAt")
VALUES 
  -- Venta 1: Hace 5 días
  ('sale-001', 'V20251008-0001', 'customer-001', 'admin-seed-001', 30000, 0, 0, 0, 30000, 'EFECTIVO', 30000, 0, 'COMPLETADA', NULL, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
  
  -- Venta 2: Hace 3 días
  ('sale-002', 'V20251010-0001', 'customer-003', 'vendedor-001', 22000, 0, 0, 0, 22000, 'TRANSFERENCIA', 22000, 0, 'COMPLETADA', NULL, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  
  -- Venta 3: Hace 2 días
  ('sale-003', 'V20251011-0001', 'customer-006', 'vendedor-001', 11500, 0, 0, 0, 11500, 'EFECTIVO', 12000, 500, 'COMPLETADA', 'Venta mostrador', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
  
  -- Venta 4: Ayer
  ('sale-004', 'V20251012-0001', 'customer-002', 'admin-seed-001', 54000, 0, 2000, 0, 52000, 'CUENTA_CORRIENTE', NULL, NULL, 'COMPLETADA', 'Pago en cuenta corriente', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
  
  -- Venta 5: Hoy
  ('sale-005', 'V20251013-0001', 'customer-005', 'vendedor-001', 16000, 0, 0, 0, 16000, 'TARJETA_DEBITO', 16000, 0, 'COMPLETADA', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("saleNumber") DO NOTHING;

-- 6. ITEMS DE VENTAS
INSERT INTO "sale_items" (id, "saleId", "productId", quantity, "unitPrice", subtotal, "createdAt")
VALUES 
  -- Items venta 1
  ('item-001', 'sale-001', 'prod-001', 2, 15000, 30000, CURRENT_TIMESTAMP - INTERVAL '5 days'),
  
  -- Items venta 2
  ('item-002', 'sale-002', 'prod-007', 1, 22000, 22000, CURRENT_TIMESTAMP - INTERVAL '3 days'),
  
  -- Items venta 3
  ('item-003', 'sale-003', 'prod-004', 2, 5500, 11000, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('item-004', 'sale-003', 'prod-017', 1, 7000, 7000, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  
  -- Items venta 4 (múltiples productos)
  ('item-005', 'sale-004', 'prod-002', 2, 16500, 33000, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('item-006', 'sale-004', 'prod-011', 1, 16000, 16000, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('item-007', 'sale-004', 'prod-004', 1, 5500, 5500, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  
  -- Items venta 5
  ('item-008', 'sale-005', 'prod-011', 1, 16000, 16000, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 7. PAGOS (para ventas con múltiples pagos si es necesario)
INSERT INTO payments (id, "saleId", amount, "paymentMethod", reference, "createdAt")
VALUES 
  ('payment-001', 'sale-001', 30000, 'EFECTIVO', NULL, CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ('payment-002', 'sale-002', 22000, 'TRANSFERENCIA', 'TRANS-20251010-001', CURRENT_TIMESTAMP - INTERVAL '3 days'),
  ('payment-003', 'sale-003', 11500, 'EFECTIVO', NULL, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('payment-004', 'sale-005', 16000, 'TARJETA_DEBITO', 'DEB-20251013-001', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 8. MOVIMIENTOS DE STOCK (ajuste inicial y ventas)
INSERT INTO "stock_movements" (id, "productId", type, quantity, "previousStock", "newStock", reason, reference, "createdAt")
VALUES 
  -- Ajuste inicial de stock
  ('stock-001', 'prod-001', 'ENTRADA', 25, 0, 25, 'Stock inicial', 'INIT-001', CURRENT_TIMESTAMP - INTERVAL '10 days'),
  ('stock-002', 'prod-004', 'ENTRADA', 50, 0, 50, 'Stock inicial', 'INIT-002', CURRENT_TIMESTAMP - INTERVAL '10 days'),
  
  -- Movimientos por ventas
  ('stock-003', 'prod-001', 'VENTA', 2, 25, 23, 'Venta V20251008-0001', 'sale-001', CURRENT_TIMESTAMP - INTERVAL '5 days'),
  ('stock-004', 'prod-004', 'VENTA', 2, 50, 48, 'Venta V20251011-0001', 'sale-003', CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- 9. CONFIGURACIÓN DEL SISTEMA
INSERT INTO config (id, key, value, "createdAt", "updatedAt")
VALUES 
  ('config-001', 'store_name', 'EXMC - Tienda de Ropa', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('config-002', 'store_address', 'Av. San Martín 1234, Mendoza', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('config-003', 'store_phone', '261-5551234', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('config-004', 'store_email', 'info@exmc.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('config-005', 'tax_rate', '0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('config-006', 'currency', 'ARS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, "updatedAt" = CURRENT_TIMESTAMP;

-- ============================================
-- FIN DEL SEED
-- ============================================
-- 
-- CREDENCIALES DE USUARIOS:
-- admin@exmc.com / admin123 (ADMIN)
-- vendedor@exmc.com / admin123 (VENDEDOR)
-- consulta@exmc.com / admin123 (CONSULTA)
-- 
-- DATOS INCLUIDOS:
-- - 3 usuarios (admin, vendedor, consulta)
-- - 4 proveedores
-- - 20 productos (jeans, remeras, vestidos, pantalones, buzos, camperas, zapatillas, accesorios)
-- - 6 clientes (5 reales + 1 consumidor final)
-- - 5 ventas de ejemplo
-- - 8 items de ventas
-- - 4 pagos registrados
-- - 4 movimientos de stock
-- - 6 configuraciones del sistema
