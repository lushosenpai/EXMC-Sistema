const crypto = require('crypto');
const Store = require('electron-store');
const { machineIdSync } = require('node-machine-id');

// Clave secreta para encriptar (cambiar en producción)
const SECRET_KEY = 'EXMC-2025-SECRET-KEY-CHANGE-THIS';

class LicenseManager {
  constructor() {
    this.store = new Store({
      name: 'license',
      encryptionKey: SECRET_KEY
    });
  }

  // Obtener ID único de la máquina
  getMachineId() {
    try {
      return machineIdSync({ original: true });
    } catch (error) {
      console.error('Error getting machine ID:', error);
      // Fallback a un ID basado en características del sistema
      const os = require('os');
      const id = `${os.platform()}-${os.hostname()}-${os.arch()}`;
      return crypto.createHash('sha256').update(id).digest('hex');
    }
  }

  // Generar código de activación para una máquina específica
  generateActivationCode(machineId, expiryDays = 365) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    const data = `${machineId}:${expiryDate.getTime()}`;
    const hash = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
    
    // Formato: XXXX-XXXX-XXXX-XXXX (16 caracteres)
    const code = hash.substring(0, 16).toUpperCase();
    return code.match(/.{1,4}/g).join('-');
  }

  // Validar código de activación
  validateActivationCode(code, machineId = null) {
    try {
      if (!code || code.length !== 19) { // XXXX-XXXX-XXXX-XXXX
        return { valid: false, message: 'Código inválido' };
      }

      const cleanCode = code.replace(/-/g, '').toUpperCase();
      const currentMachineId = machineId || this.getMachineId();

      // Verificar diferentes períodos de expiración
      for (let days = 1; days <= 3650; days += 1) { // Hasta 10 años
        const testCode = this.generateActivationCode(currentMachineId, days);
        const cleanTestCode = testCode.replace(/-/g, '');
        
        if (cleanCode === cleanTestCode) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + days);
          
          return {
            valid: true,
            message: 'Código válido',
            expiryDate: expiryDate,
            daysRemaining: days
          };
        }
      }

      return { valid: false, message: 'Código inválido para esta máquina' };
    } catch (error) {
      console.error('Error validating code:', error);
      return { valid: false, message: 'Error al validar código' };
    }
  }

  // Activar licencia
  activateLicense(activationCode) {
    const validation = this.validateActivationCode(activationCode);
    
    if (validation.valid) {
      this.store.set('license', {
        activated: true,
        activationCode: activationCode,
        machineId: this.getMachineId(),
        activationDate: new Date().toISOString(),
        expiryDate: validation.expiryDate.toISOString(),
        isTrial: false
      });
      return { success: true, ...validation };
    }
    
    return { success: false, message: validation.message };
  }

  // Iniciar período de prueba
  startTrial() {
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 15); // 15 días de prueba

    this.store.set('license', {
      activated: false,
      isTrial: true,
      trialStart: trialStart.toISOString(),
      trialEnd: trialEnd.toISOString(),
      machineId: this.getMachineId()
    });

    return {
      success: true,
      message: 'Período de prueba iniciado',
      daysRemaining: 15
    };
  }

  // Verificar estado de la licencia
  checkLicense() {
    const license = this.store.get('license');
    
    if (!license) {
      return {
        status: 'no_license',
        message: 'No hay licencia registrada',
        canUseTrial: true
      };
    }

    // Licencia activada
    if (license.activated && !license.isTrial) {
      const expiryDate = new Date(license.expiryDate);
      const now = new Date();
      
      if (now > expiryDate) {
        return {
          status: 'expired',
          message: 'Licencia expirada',
          expiryDate: expiryDate
        };
      }

      const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      
      return {
        status: 'active',
        message: 'Licencia activa',
        daysRemaining: daysRemaining,
        expiryDate: expiryDate,
        activationDate: new Date(license.activationDate)
      };
    }

    // Período de prueba
    if (license.isTrial) {
      const trialEnd = new Date(license.trialEnd);
      const now = new Date();

      if (now > trialEnd) {
        return {
          status: 'trial_expired',
          message: 'Período de prueba expirado',
          trialEnd: trialEnd
        };
      }

      const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

      return {
        status: 'trial',
        message: `Período de prueba (${daysRemaining} días restantes)`,
        daysRemaining: daysRemaining,
        trialEnd: trialEnd
      };
    }

    return {
      status: 'invalid',
      message: 'Estado de licencia desconocido'
    };
  }

  // Obtener información de la licencia
  getLicenseInfo() {
    return this.store.get('license');
  }

  // Resetear licencia (solo para desarrollo)
  resetLicense() {
    this.store.delete('license');
  }

  // Obtener ID de máquina para generar códigos
  getMachineIdForActivation() {
    return this.getMachineId();
  }
}

module.exports = LicenseManager;
