const crypto = require('crypto');

// Misma clave secreta que en license.js
const SECRET_KEY = 'EXMC-2025-SECRET-KEY-CHANGE-THIS';

// Generar código de activación
function generateActivationCode(machineId, expiryDays = 365) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  
  const data = `${machineId}:${expiryDate.getTime()}`;
  const hash = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  
  // Formato: XXXX-XXXX-XXXX-XXXX
  const code = hash.substring(0, 16).toUpperCase();
  return code.match(/.{1,4}/g).join('-');
}

// Programa principal
console.log('==============================================');
console.log('  GENERADOR DE CÓDIGOS - SISTEMA EXMC');
console.log('  Desarrollador: Luciano Savoretti');
console.log('==============================================\n');

// Obtener argumentos
const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Uso: node generate-license.js <MACHINE_ID> [DIAS_VALIDEZ]\n');
  console.log('Ejemplos:');
  console.log('  node generate-license.js abc123def456 365    (1 año)');
  console.log('  node generate-license.js abc123def456 3650   (10 años)');
  console.log('  node generate-license.js abc123def456 30     (1 mes)');
  console.log('\nEl cliente debe proporcionarte su MACHINE_ID desde la ventana de activación.\n');
  process.exit(0);
}

const machineId = args[0];
const days = args[1] ? parseInt(args[1]) : 365;

console.log(`Machine ID: ${machineId}`);
console.log(`Validez: ${days} días (${Math.floor(days/365)} años, ${days%365} días)\n`);

const code = generateActivationCode(machineId, days);

console.log('╔════════════════════════════════════════════╗');
console.log('║        CÓDIGO DE ACTIVACIÓN GENERADO       ║');
console.log('╠════════════════════════════════════════════╣');
console.log(`║          ${code}          ║`);
console.log('╚════════════════════════════════════════════╝\n');

console.log('✅ Envía este código al cliente para que active su licencia.\n');

// Generar varios códigos de ejemplo
console.log('Códigos para diferentes períodos:');
console.log('──────────────────────────────────────────────');
console.log(`30 días:   ${generateActivationCode(machineId, 30)}`);
console.log(`90 días:   ${generateActivationCode(machineId, 90)}`);
console.log(`180 días:  ${generateActivationCode(machineId, 180)}`);
console.log(`1 año:     ${generateActivationCode(machineId, 365)}`);
console.log(`2 años:    ${generateActivationCode(machineId, 730)}`);
console.log(`5 años:    ${generateActivationCode(machineId, 1825)}`);
console.log(`10 años:   ${generateActivationCode(machineId, 3650)}`);
console.log('──────────────────────────────────────────────\n');
