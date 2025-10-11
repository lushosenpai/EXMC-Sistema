/**
 * 🔧 Configuración de AFIP para Facturación Electrónica
 * 
 * Este archivo está listo para usar cuando tengas los certificados de AFIP.
 * Solo necesitas completar las variables de entorno en .env
 */

export const afipConfig = {
  // CUIT de la empresa
  CUIT: parseInt(process.env.AFIP_CUIT || '0'),
  
  // Ambiente: false = testing, true = production
  production: process.env.AFIP_ENVIRONMENT === 'production',
  
  // Rutas a los certificados
  cert: process.env.AFIP_CERT_PATH || './certs/testing/certificate.crt',
  key: process.env.AFIP_KEY_PATH || './certs/testing/private_key.key',
  
  // Password del certificado (opcional)
  passphrase: process.env.AFIP_CERT_PASSPHRASE || undefined,
  
  // Punto de venta
  puntoVenta: parseInt(process.env.AFIP_PUNTO_VENTA || '1'),
};

/**
 * Tipos de Comprobante AFIP
 */
export const TipoComprobante = {
  FACTURA_A: 1,
  FACTURA_B: 6,
  FACTURA_C: 11,
  NOTA_DEBITO_A: 2,
  NOTA_DEBITO_B: 7,
  NOTA_DEBITO_C: 12,
  NOTA_CREDITO_A: 3,
  NOTA_CREDITO_B: 8,
  NOTA_CREDITO_C: 13,
  RECIBO_A: 4,
  RECIBO_B: 9,
  RECIBO_C: 15,
};

/**
 * Tipos de Documento
 */
export const TipoDocumento = {
  CUIT: 80,
  CUIL: 86,
  DNI: 96,
  PASAPORTE: 94,
  CEDULA: 95,
};

/**
 * Tipos de Concepto
 */
export const TipoConcepto = {
  PRODUCTOS: 1,
  SERVICIOS: 2,
  PRODUCTOS_Y_SERVICIOS: 3,
};

/**
 * Tipos de IVA
 */
export const TipoIVA = {
  IVA_21: 5,
  IVA_10_5: 4,
  IVA_27: 6,
  IVA_5: 8,
  IVA_2_5: 9,
  EXENTO: 3,
  NO_GRAVADO: 1,
};

/**
 * Validar configuración
 */
export function validateAfipConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!afipConfig.CUIT || afipConfig.CUIT === 0) {
    errors.push('AFIP_CUIT no está configurado en .env');
  }

  if (!process.env.AFIP_CERT_PATH) {
    errors.push('AFIP_CERT_PATH no está configurado en .env');
  }

  if (!process.env.AFIP_KEY_PATH) {
    errors.push('AFIP_KEY_PATH no está configurado en .env');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Verificar si AFIP está configurado y listo para usar
 */
export function isAfipConfigured(): boolean {
  try {
    const fs = require('fs');
    
    // Verificar que existan los archivos de certificados
    const certExists = fs.existsSync(afipConfig.cert);
    const keyExists = fs.existsSync(afipConfig.key);
    
    return certExists && keyExists && afipConfig.CUIT > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Obtener información del ambiente actual
 */
export function getAfipEnvironmentInfo() {
  return {
    configured: isAfipConfigured(),
    environment: afipConfig.production ? 'PRODUCCIÓN' : 'TESTING',
    cuit: afipConfig.CUIT,
    puntoVenta: afipConfig.puntoVenta,
    certPath: afipConfig.cert,
    keyPath: afipConfig.key,
  };
}
