/**
 * 🔧 Configuración de Mercado Pago
 * 
 * Este archivo está listo para usar cuando tengas las credenciales de Mercado Pago.
 * Solo necesitas completar las variables de entorno en .env
 */

export const mercadoPagoConfig = {
  // Access Token (Backend)
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  
  // Public Key (Frontend)
  publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || '',
  
  // URLs de retorno
  successUrl: process.env.MERCADOPAGO_SUCCESS_URL || 'http://localhost:5173/ventas/payment-success',
  failureUrl: process.env.MERCADOPAGO_FAILURE_URL || 'http://localhost:5173/ventas/payment-failure',
  pendingUrl: process.env.MERCADOPAGO_PENDING_URL || 'http://localhost:5173/ventas/payment-pending',
  
  // Webhook URL
  webhookUrl: process.env.MERCADOPAGO_WEBHOOK_URL || 'http://localhost:3001/api/payments/webhook',
  
  // Ambiente
  isTesting: process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-') || true,
};

/**
 * Validar configuración de Mercado Pago
 */
export function validateMercadoPagoConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!mercadoPagoConfig.accessToken) {
    errors.push('MERCADOPAGO_ACCESS_TOKEN no está configurado en .env');
  }

  if (!mercadoPagoConfig.publicKey) {
    errors.push('MERCADOPAGO_PUBLIC_KEY no está configurado en .env');
  }

  if (mercadoPagoConfig.accessToken && 
      !mercadoPagoConfig.accessToken.startsWith('TEST-') && 
      !mercadoPagoConfig.accessToken.startsWith('APP_USR-')) {
    errors.push('MERCADOPAGO_ACCESS_TOKEN tiene formato inválido');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Verificar si Mercado Pago está configurado
 */
export function isMercadoPagoConfigured(): boolean {
  return !!(
    mercadoPagoConfig.accessToken &&
    mercadoPagoConfig.publicKey &&
    mercadoPagoConfig.accessToken !== 'TEST-YOUR_ACCESS_TOKEN_HERE'
  );
}

/**
 * Obtener información del ambiente actual
 */
export function getMercadoPagoEnvironmentInfo() {
  return {
    configured: isMercadoPagoConfigured(),
    environment: mercadoPagoConfig.isTesting ? 'TESTING' : 'PRODUCCIÓN',
    accessToken: mercadoPagoConfig.accessToken ? `${mercadoPagoConfig.accessToken.slice(0, 15)}...` : 'No configurado',
    publicKey: mercadoPagoConfig.publicKey ? `${mercadoPagoConfig.publicKey.slice(0, 15)}...` : 'No configurado',
    successUrl: mercadoPagoConfig.successUrl,
    webhookUrl: mercadoPagoConfig.webhookUrl,
  };
}

/**
 * Estados de pago de Mercado Pago
 */
export const PaymentStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  AUTHORIZED: 'authorized',
  IN_PROCESS: 'in_process',
  IN_MEDIATION: 'in_mediation',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  CHARGED_BACK: 'charged_back',
};

/**
 * Tipos de pago
 */
export const PaymentType = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  TICKET: 'ticket',
  BANK_TRANSFER: 'bank_transfer',
  ATM: 'atm',
  DIGITAL_CURRENCY: 'digital_currency',
  DIGITAL_WALLET: 'digital_wallet',
};
