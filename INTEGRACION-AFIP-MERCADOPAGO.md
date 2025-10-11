# 🇦🇷 Integración AFIP y Medios de Pago - Guía Completa

## 📋 Índice
1. [Facturación Electrónica AFIP](#facturación-electrónica-afip)
2. [Integración Mercado Pago](#integración-mercado-pago)
3. [Otras Pasarelas de Pago](#otras-pasarelas-de-pago)
4. [Implementación en el Sistema](#implementación-en-el-sistema)

---

## 🧾 Facturación Electrónica AFIP

### **Requisitos Previos**

1. **CUIT de la Empresa**
2. **Punto de Venta habilitado en AFIP**
   - Ingresar a AFIP → Administrador de Relaciones → Comprobantes en línea
   - Solicitar punto de venta
3. **Certificado Digital**
   - Generar CSR (Certificate Signing Request)
   - Solicitar certificado en AFIP
   - Descargar .crt y .key
4. **Clave Fiscal** nivel 3 o superior

---

### **Opción A: SDK de AFIP (Node.js)**

#### **1. Instalación**

```bash
cd backend
npm install @afipsdk/afip.js
```

#### **2. Configuración Inicial**

```typescript
// backend/src/config/afip.config.ts

import Afip from '@afipsdk/afip.js';

export const afipConfig = {
  CUIT: 20123456789, // CUIT de tu empresa
  production: false, // false = testing, true = producción
  cert: 'path/to/certificate.crt',
  key: 'path/to/private.key',
  passphrase: 'password_del_certificado', // Si tiene password
};

export const afip = new Afip(afipConfig);
```

#### **3. Estructura de Archivos**

```
backend/
├── certs/
│   ├── testing/
│   │   ├── certificate.crt
│   │   └── private_key.key
│   └── production/
│       ├── certificate.crt
│       └── private_key.key
├── src/
│   ├── config/
│   │   └── afip.config.ts
│   └── services/
│       └── afip.service.ts
```

#### **4. Servicio de Facturación**

```typescript
// backend/src/services/afip.service.ts

import { afip } from '../config/afip.config';

interface InvoiceData {
  puntoVenta: number;
  tipoComprobante: number; // 6 = Factura B, 11 = Factura C
  concepto: number; // 1 = Productos, 2 = Servicios, 3 = Productos y Servicios
  tipoDoc: number; // 80 = CUIT, 96 = DNI
  numeroDoc: number;
  importeTotal: number;
  importeNeto: number;
  importeIVA: number;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export class AfipService {
  /**
   * Generar Factura Electrónica
   */
  async generateInvoice(data: InvoiceData) {
    try {
      // 1. Obtener el último número de comprobante
      const lastVoucher = await afip.ElectronicBilling.getLastVoucher(
        data.puntoVenta,
        data.tipoComprobante
      );

      const nextVoucherNumber = lastVoucher + 1;

      // 2. Preparar los datos de la factura
      const invoiceData = {
        CantReg: 1, // Cantidad de comprobantes
        PtoVta: data.puntoVenta,
        CbteTipo: data.tipoComprobante,
        Concepto: data.concepto,
        DocTipo: data.tipoDoc,
        DocNro: data.numeroDoc,
        CbteDesde: nextVoucherNumber,
        CbteHasta: nextVoucherNumber,
        CbteFch: this.getCurrentDate(), // Formato YYYYMMDD
        ImpTotal: data.importeTotal,
        ImpTotConc: 0, // Importe neto no gravado
        ImpNeto: data.importeNeto,
        ImpOpEx: 0, // Importe exento
        ImpIVA: data.importeIVA,
        ImpTrib: 0, // Otros tributos
        MonId: 'PES', // Moneda (PES = Pesos)
        MonCotiz: 1,
        // IVA
        Iva: [
          {
            Id: 5, // 21%
            BaseImp: data.importeNeto,
            Importe: data.importeIVA,
          },
        ],
      };

      // 3. Crear el comprobante en AFIP
      const result = await afip.ElectronicBilling.createVoucher(invoiceData);

      // 4. Devolver datos del comprobante
      return {
        success: true,
        cae: result.CAE, // Código de Autorización Electrónico
        caeVencimiento: result.CAEFchVto,
        numeroComprobante: nextVoucherNumber,
        puntoVenta: data.puntoVenta,
        tipoComprobante: data.tipoComprobante,
        qrData: this.generateQRData(result),
      };
    } catch (error) {
      console.error('Error al generar factura en AFIP:', error);
      throw new Error('Error al generar factura electrónica');
    }
  }

  /**
   * Consultar comprobante existente
   */
  async getInvoice(puntoVenta: number, tipoComprobante: number, numeroComprobante: number) {
    try {
      const result = await afip.ElectronicBilling.getVoucherInfo(
        numeroComprobante,
        puntoVenta,
        tipoComprobante
      );
      return result;
    } catch (error) {
      throw new Error('Error al consultar factura');
    }
  }

  /**
   * Generar datos para código QR (obligatorio en facturas argentinas)
   */
  private generateQRData(invoiceResult: any): string {
    const qrData = {
      ver: 1,
      fecha: invoiceResult.CbteFch,
      cuit: afipConfig.CUIT,
      ptoVta: invoiceResult.PtoVta,
      tipoCmp: invoiceResult.CbteTipo,
      nroCmp: invoiceResult.CbteDesde,
      importe: invoiceResult.ImpTotal,
      moneda: 'PES',
      ctz: 1,
      tipoDocRec: invoiceResult.DocTipo,
      nroDocRec: invoiceResult.DocNro,
      tipoCodAut: 'E',
      codAut: invoiceResult.CAE,
    };

    // Codificar en Base64 para QR
    return Buffer.from(JSON.stringify(qrData)).toString('base64');
  }

  /**
   * Obtener fecha actual en formato AFIP (YYYYMMDD)
   */
  private getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}

export const afipService = new AfipService();
```

#### **5. Integrar en el Controlador de Ventas**

```typescript
// backend/src/controllers/sale.controller.ts

import { afipService } from '../services/afip.service';

export const createSale = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // ... código existente de crear venta ...

    // Después de crear la venta exitosamente:
    const sale = await prisma.sale.create({ /* ... */ });

    // Si el cliente tiene CUIT/CUIL, generar factura electrónica
    if (customer && customer.cuitDni) {
      try {
        const invoice = await afipService.generateInvoice({
          puntoVenta: 1, // Tu punto de venta
          tipoComprobante: 6, // 6 = Factura B (ajustar según corresponda)
          concepto: 1, // 1 = Productos
          tipoDoc: 80, // 80 = CUIT (usar 96 para DNI)
          numeroDoc: parseInt(customer.cuitDni),
          importeTotal: sale.total,
          importeNeto: sale.subtotal,
          importeIVA: sale.tax,
          items: sale.items.map(item => ({
            description: item.product.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.subtotal,
          })),
        });

        // Guardar datos de la factura en la venta
        await prisma.sale.update({
          where: { id: sale.id },
          data: {
            invoiceCAE: invoice.cae,
            invoiceCAEExpiration: invoice.caeVencimiento,
            invoiceNumber: invoice.numeroComprobante.toString(),
            invoiceQR: invoice.qrData,
          },
        });
      } catch (error) {
        console.error('Error al generar factura AFIP:', error);
        // Continuar aunque falle la facturación
      }
    }

    res.json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
};
```

#### **6. Actualizar Schema de Prisma**

```prisma
// backend/prisma/schema.prisma

model Sale {
  // ... campos existentes ...
  
  // Campos de facturación AFIP
  invoiceCAE           String?   // Código de Autorización Electrónico
  invoiceCAEExpiration String?   // Fecha de vencimiento del CAE
  invoiceNumber        String?   // Número de factura
  invoiceQR            String?   @db.Text // Datos del QR en base64
}
```

---

## 💳 Integración Mercado Pago

### **¿Por qué Mercado Pago?**

✅ **Más usado en Argentina**
✅ **Acepta todas las tarjetas argentinas**
✅ **Transferencias, débito, crédito, QR**
✅ **API simple y bien documentada**
✅ **Sandbox para testing**

---

### **1. Crear Cuenta en Mercado Pago**

1. Registrarse en https://www.mercadopago.com.ar/developers
2. Crear una aplicación
3. Obtener credenciales:
   - **Public Key** (para frontend)
   - **Access Token** (para backend)

---

### **2. Instalación**

```bash
cd backend
npm install mercadopago

cd ../frontend
npm install @mercadopago/sdk-react
```

---

### **3. Configuración Backend**

```typescript
// backend/src/config/mercadopago.config.ts

import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export { mercadopago };
```

```env
# backend/.env
MERCADOPAGO_ACCESS_TOKEN=TEST-123456789-123456-abc123def456
MERCADOPAGO_PUBLIC_KEY=TEST-abc123-def456-789012
```

---

### **4. Crear Preferencia de Pago**

```typescript
// backend/src/services/mercadopago.service.ts

import { mercadopago } from '../config/mercadopago.config';

export class MercadoPagoService {
  /**
   * Crear preferencia de pago
   */
  async createPaymentPreference(saleData: any) {
    try {
      const preference = {
        items: saleData.items.map((item: any) => ({
          title: item.product.name,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          currency_id: 'ARS',
        })),
        payer: {
          name: saleData.customer.name,
          email: saleData.customer.email || 'cliente@email.com',
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/ventas/success`,
          failure: `${process.env.FRONTEND_URL}/ventas/failure`,
          pending: `${process.env.FRONTEND_URL}/ventas/pending`,
        },
        auto_return: 'approved',
        external_reference: saleData.saleId, // ID de tu venta
        notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      };

      const response = await mercadopago.preferences.create(preference);
      
      return {
        id: response.body.id,
        init_point: response.body.init_point, // URL para pagar
        sandbox_init_point: response.body.sandbox_init_point, // URL testing
      };
    } catch (error) {
      console.error('Error al crear preferencia de Mercado Pago:', error);
      throw error;
    }
  }

  /**
   * Verificar estado del pago
   */
  async getPaymentInfo(paymentId: string) {
    try {
      const payment = await mercadopago.payment.findById(parseInt(paymentId));
      return payment.body;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Webhook para notificaciones de Mercado Pago
   */
  async handleWebhook(paymentData: any) {
    try {
      if (paymentData.type === 'payment') {
        const payment = await this.getPaymentInfo(paymentData.data.id);
        
        // Actualizar estado de la venta según el pago
        if (payment.status === 'approved') {
          await prisma.sale.update({
            where: { id: payment.external_reference },
            data: {
              status: 'COMPLETADA',
              // Guardar datos del pago
            },
          });
        }
      }
    } catch (error) {
      console.error('Error en webhook de Mercado Pago:', error);
    }
  }
}

export const mercadoPagoService = new MercadoPagoService();
```

---

### **5. Rutas de Pago**

```typescript
// backend/src/routes/payment.routes.ts

import { Router } from 'express';
import { mercadoPagoService } from '../services/mercadopago.service';

const router = Router();

// Crear preferencia de pago
router.post('/create-preference', async (req, res) => {
  try {
    const preference = await mercadoPagoService.createPaymentPreference(req.body);
    res.json({ success: true, data: preference });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al crear preferencia' });
  }
});

// Webhook de Mercado Pago
router.post('/webhook', async (req, res) => {
  try {
    await mercadoPagoService.handleWebhook(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
```

---

### **6. Frontend - Botón de Pago**

```typescript
// frontend/src/components/MercadoPagoButton.tsx

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useState } from 'react';

// Inicializar con tu Public Key
initMercadoPago('TEST-abc123-def456-789012');

interface Props {
  saleData: any;
}

export const MercadoPagoButton = ({ saleData }: Props) => {
  const [preferenceId, setPreferenceId] = useState<string>('');

  const createPreference = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });
      
      const data = await response.json();
      setPreferenceId(data.data.id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {!preferenceId ? (
        <button onClick={createPreference} className="btn-primary">
          💳 Pagar con Mercado Pago
        </button>
      ) : (
        <Wallet initialization={{ preferenceId }} />
      )}
    </div>
  );
};
```

---

## 🏦 Otras Pasarelas de Pago Argentinas

### **1. TODO PAGO**
- https://developers.todopago.com.ar/
- Banco Macro

### **2. Decidir (ex Visa Net)**
- https://decidir.com.ar/
- Para tarjetas Visa

### **3. Prisma (Mastercard)**
- https://prisma.com.ar/
- Para tarjetas Mastercard

### **4. Payway (Prismadecidio)**
- https://decidir.com.ar/payway
- Portal unificado

---

## 📊 Flujo Completo Integrado

```
Usuario crea venta en el sistema
         ↓
Sistema guarda venta localmente
         ↓
¿Cliente tiene CUIT? → Sí → Generar factura en AFIP
         ↓                           ↓
         No                  Guardar CAE y QR
         ↓                           ↓
¿Pago online? → Sí → Crear preferencia en Mercado Pago
         ↓                           ↓
         No                  Redirigir a Mercado Pago
         ↓                           ↓
   Pago efectivo           Cliente paga online
         ↓                           ↓
   Venta completada        Webhook notifica pago
         ↓                           ↓
         └───────────────────────────┘
                     ↓
           Actualizar estado de venta
                     ↓
            Generar PDF con factura
                     ↓
             Enviar por email
```

---

## 🚀 Implementación Sugerida (Paso a Paso)

### **Fase 1: Testing Local (AHORA)**
1. ✅ Usar Mercado Pago Sandbox
2. ✅ Facturación simulada (sin AFIP real)
3. ✅ Testing con datos de prueba

### **Fase 2: Preparación AFIP**
1. Tramitar certificado digital
2. Habilitar punto de venta
3. Testing en ambiente de homologación AFIP

### **Fase 3: Producción**
1. Activar credenciales de producción
2. Mercado Pago en modo live
3. AFIP en producción

---

## 📝 Archivos Necesarios

```
backend/
├── certs/
│   ├── testing/
│   └── production/
├── src/
│   ├── config/
│   │   ├── afip.config.ts
│   │   └── mercadopago.config.ts
│   ├── services/
│   │   ├── afip.service.ts
│   │   └── mercadopago.service.ts
│   └── routes/
│       └── payment.routes.ts

frontend/
├── src/
│   └── components/
│       ├── MercadoPagoButton.tsx
│       └── InvoiceViewer.tsx
```

---

## 💰 Costos Aproximados

| Servicio | Costo |
|----------|-------|
| Mercado Pago | 3.99% + IVA por transacción |
| TODO PAGO | 2.9% - 4.5% |
| Decidir | 3% - 5% |
| AFIP | Gratis |
| Certificado Digital | $500 - $2000 ARS/año |

---

## 🎯 Recomendación

**Para comenzar AHORA:**
1. ✅ Integrar Mercado Pago (más fácil)
2. ✅ Usar Sandbox para testing
3. ⏸️ AFIP dejarlo para después (requiere trámites)

**Para ir a producción:**
1. Tramitar certificado AFIP
2. Activar Mercado Pago producción
3. Configurar webhooks y notificaciones

---

## 📚 Recursos Útiles

- **AFIP SDK**: https://github.com/afipsdk/afip.js
- **Mercado Pago Docs**: https://www.mercadopago.com.ar/developers
- **AFIP Web Services**: https://www.afip.gob.ar/ws/
- **Testing AFIP**: http://wswhomo.afip.gov.ar/

---

¿Quieres que implemente alguna de estas integraciones ahora? 🚀
