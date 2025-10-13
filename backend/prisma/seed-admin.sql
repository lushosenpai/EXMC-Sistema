-- Seed básico: Usuario administrador
-- Password: admin123 (hasheado con bcrypt rounds=10)

INSERT INTO users (id, email, password, name, role, "isActive", "createdAt", "updatedAt")
VALUES (
  'admin-seed-001',
  'admin@exmc.com',
  '$2b$10$dm.tU0jQUVn6BmNiRAcggOwfngqi8UTBIBcocEvBKS.5jC/zvh89S',
  'Administrador',
  'ADMIN',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Credenciales por defecto:
-- Email: admin@exmc.com
-- Password: admin123
