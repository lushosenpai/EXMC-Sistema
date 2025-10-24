// Script para crear una base de datos template con datos iniciales
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function createTemplateDB() {
  console.log('📦 Creando base de datos template...');
  
  // Asegurar que usamos una BD temporal
  const templatePath = path.join(__dirname, 'prisma', 'template.db');
  
  // Eliminar si existe
  if (fs.existsSync(templatePath)) {
    fs.unlinkSync(templatePath);
    console.log('🗑️  BD anterior eliminada');
  }
  
  // Crear el schema con Prisma
  console.log('🔨 Creando schema de base de datos...');
  try {
    execSync('npx prisma db push --skip-generate', {
      cwd: __dirname,
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: `file:${templatePath}` }
    });
  } catch (error) {
    console.error('❌ Error creando schema');
    process.exit(1);
  }
  
  // Configurar Prisma para usar la BD template
  process.env.DATABASE_URL = `file:${templatePath}`;
  
  const prisma = new PrismaClient();
  
  try {
    // Hash de contraseña
    const hashedPassword = await bcrypt.hashSync('admin123', 10);
    
    // Crear usuario admin
    await prisma.user.create({
      data: {
        email: 'admin@exmc.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'ADMIN',
        isActive: true
      }
    });
    
    console.log('✅ Usuario administrador creado');
    
    // Crear configuraciones por defecto
    const configs = [
      { key: 'business_name', value: 'Mi Negocio' },
      { key: 'business_address', value: '' },
      { key: 'business_phone', value: '' },
      { key: 'business_email', value: '' },
      { key: 'tax_percentage', value: '21' }
    ];
    
    for (const config of configs) {
      await prisma.config.create({
        data: config
      });
    }
    
    console.log('✅ Configuraciones creadas');
    
    // Verificar
    const userCount = await prisma.user.count();
    const configCount = await prisma.config.count();
    
    console.log(`\n✅ Base de datos template creada exitosamente:`);
    console.log(`   👤 Usuarios: ${userCount}`);
    console.log(`   ⚙️  Configuraciones: ${configCount}`);
    console.log(`   📁 Ubicación: ${templatePath}`);
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createTemplateDB();
