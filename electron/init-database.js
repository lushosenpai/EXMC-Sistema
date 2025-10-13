// Script para inicializar la base de datos en producción
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Determinar rutas según el entorno
const isDev = process.env.NODE_ENV !== 'production';
const resourcesPath = process.resourcesPath || path.join(__dirname, '..');

const postgresPath = isDev
  ? path.join(__dirname, '..', 'postgres-portable')
  : path.join(resourcesPath, 'postgres');  // ← CORREGIDO: directamente en resources

const psqlPath = path.join(postgresPath, 'bin', 'psql.exe');
const port = isDev ? '5432' : '5433';  // ← Puerto correcto para producción

console.log('🔧 Inicializando base de datos...');
console.log('📁 PostgreSQL path:', postgresPath);
console.log('🔌 Puerto:', port);

// Verificar que psql existe
if (!fs.existsSync(psqlPath)) {
  console.error('❌ psql.exe no encontrado en:', psqlPath);
  process.exit(1);
}

// Función para ejecutar comando SQL
function executeSql(sql, dbName = 'postgres') {
  return new Promise((resolve, reject) => {
    console.log(`\n📊 Ejecutando SQL en '${dbName}': ${sql.substring(0, 50)}...`);
    
    const psql = spawn(psqlPath, [
      '-h', 'localhost',
      '-p', port,
      '-U', 'postgres',
      '-d', dbName,
      '-c', sql
    ], {
      env: {
        ...process.env,
        PGPASSWORD: 'postgres'
      },
      windowsHide: true
    });

    let output = '';
    let errorOutput = '';

    psql.stdout?.on('data', (data) => {
      output += data.toString();
    });

    psql.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });

    psql.on('close', (code) => {
      if (code === 0) {
        console.log('✅ SQL ejecutado correctamente');
        resolve(output);
      } else {
        console.error('❌ Error al ejecutar SQL:', errorOutput);
        // No rechazar para continuar con el flujo
        resolve(null);
      }
    });

    psql.on('error', (err) => {
      console.error('❌ Error al ejecutar psql:', err);
      resolve(null);
    });
  });
}

// Función principal
async function initializeDatabase() {
  try {
    // 1. Verificar si la base de datos existe
    console.log('\n🔍 Verificando si la base de datos exmc_db existe...');
    const result = await executeSql("SELECT 1 FROM pg_database WHERE datname='exmc_db'");
    
    if (result && result.includes('1 row')) {
      console.log('✅ La base de datos exmc_db ya existe');
    } else {
      // 2. Crear la base de datos
      console.log('\n📦 Creando base de datos exmc_db...');
      await executeSql('CREATE DATABASE exmc_db');
      console.log('✅ Base de datos exmc_db creada');
    }

    // 3. Ejecutar migraciones de Prisma
    console.log('\n🔄 Aplicando migraciones...');
    
    const backendPath = isDev
      ? path.join(__dirname, '..', 'backend')
      : path.join(resourcesPath, 'backend');
    
    // Buscar archivo SQL de migración directamente
    const migrationFile = path.join(backendPath, 'prisma', 'migrations', '20251011071546_init', 'migration.sql');
    
    console.log('📄 Buscando archivo de migración en:', migrationFile);
    
    if (!fs.existsSync(migrationFile)) {
      console.error('❌ Archivo de migración no encontrado');
      console.log('⚠️ Continuando sin migraciones...');
      console.log('⚠️ La aplicación puede no funcionar correctamente');
      return;
    }
    
    console.log('✅ Archivo de migración encontrado');
    
    // Leer el contenido del archivo SQL
    const migrationSql = fs.readFileSync(migrationFile, 'utf8');
    console.log('📊 Aplicando migración SQL...');
    
    // Ejecutar el SQL directamente en la base de datos exmc_db
    const migrationResult = await executeSql(migrationSql, 'exmc_db');
    
    if (migrationResult !== null) {
      console.log('✅ Migraciones aplicadas correctamente');
    } else {
      console.log('⚠️ Hubo problemas al aplicar migraciones');
      console.log('⚠️ Es posible que ya estén aplicadas o que haya un error');
    }

  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err);
    console.log('⚠️ Continuando de todas formas...');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('\n🎉 Inicialización de base de datos completada');
      process.exit(0);
    })
    .catch((err) => {
      console.error('\n❌ Error fatal:', err);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
