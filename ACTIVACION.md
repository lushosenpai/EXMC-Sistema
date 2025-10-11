# 🚀 GUÍA DE ACTIVACIÓN - AFIP Y MERCADO PAGO

## 📋 Estado Actual del Sistema

✅ **Código implementado y listo**
✅ **Estructura de archivos creada**
✅ **Configuración preparada**
⏸️ **Pendiente**: Credenciales y certificados

---

## 🎯 Qué Está Implementado

### ✅ Facturación Electrónica AFIP
- Configuración lista en `/backend/src/config/afip.config.ts`
- Estructura de certificados en `/backend/certs/`
- Constantes y tipos definidos
- Validaciones automáticas

### ✅ Mercado Pago
- Configuración lista en `/backend/src/config/mercadopago.config.ts`
- Variables de entorno preparadas
- Rutas de pago configuradas
- Webhooks preparados

### ✅ Infraestructura
- Carpetas de certificados creadas
- `.env.example` actualizado con todas las variables
- Documentación completa
- Guías de implementación

---

## 🔧 PASO A PASO PARA ACTIVAR

### 📝 FASE 1: Preparación (AHORA)

#### 1. Revisar Documentación
```bash
# Leer estos archivos:
INTEGRACION-AFIP-MERCADOPAGO.md        # Guía completa
backend/certs/testing/README.md         # Instrucciones AFIP Testing
backend/certs/production/README.md      # Instrucciones AFIP Producción
backend/.env.example                    # Variables de entorno
```

#### 2. Copiar .env.example
```bash
cd backend
cp .env.example .env
```

---

### 🧪 FASE 2: Testing con Mercado Pago (PRIMER PASO)

**⏱️ Tiempo estimado: 30 minutos**

#### 1. Crear Cuenta en Mercado Pago
- Ir a: https://www.mercadopago.com.ar/developers
- Registrarse o iniciar sesión
- Crear una aplicación

#### 2. Obtener Credenciales de Testing
- En tu aplicación, ir a **"Credenciales"**
- Copiar **"Access Token de Prueba"** (TEST-...)
- Copiar **"Public Key de Prueba"** (TEST-...)

#### 3. Configurar .env
```env
# Pegar las credenciales obtenidas
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-123456-abc123def456-abc123def456
MERCADOPAGO_PUBLIC_KEY=TEST-abc123-def456-789012-abc123def456
```

#### 4. Instalar Dependencias
```bash
cd backend
npm install mercadopago
```

#### 5. Reiniciar Servidor
```bash
npm run dev
```

#### 6. Probar
- Crear una venta en el sistema
- Seleccionar "Pagar con Mercado Pago"
- Usar tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

**Tarjetas de prueba:**
```
Visa aprobada: 4509 9535 6623 3704
Mastercard aprobada: 5031 7557 3453 0604
```

---

### 📋 FASE 3: Tramitar AFIP (CUANDO ESTÉ LISTO)

**⏱️ Tiempo estimado: 1-2 semanas**

#### 1. Requisitos Previos
- ✅ CUIT de la empresa
- ✅ Clave Fiscal nivel 3 o superior
- ✅ Estar inscripto en IVA (si aplica)

#### 2. Habilitar Punto de Venta
1. Ingresar a AFIP con Clave Fiscal
2. **"Administrador de Relaciones"**
3. **"Comprobantes en Línea"**
4. Solicitar nuevo punto de venta
5. Anotar el número de punto de venta (ej: 1, 2, 3...)

#### 3. Solicitar Certificado Digital

##### Opción A: Ambiente de Testing (Primero)
```bash
# 1. Generar CSR
cd backend/certs/testing
openssl req -new -newkey rsa:2048 -nodes \
  -keyout private_key.key \
  -out certificate.csr \
  -subj "/C=AR/O=TuEmpresa/CN=testing"

# 2. Solicitar en AFIP
# - Ir a: https://www.afip.gob.ar/ws/WSASS/
# - Subir certificate.csr
# - Seleccionar "Facturación Electrónica - Testing"
# - Descargar certificate.crt

# 3. Configurar .env
AFIP_CUIT=20123456789
AFIP_ENVIRONMENT=testing
AFIP_CERT_PATH=./certs/testing/certificate.crt
AFIP_KEY_PATH=./certs/testing/private_key.key
AFIP_PUNTO_VENTA=1
```

##### Opción B: Producción (Después de probar)
```bash
# Mismo proceso pero en carpeta production/
cd backend/certs/production
# ... repetir pasos con environment=production
```

#### 4. Instalar SDK de AFIP
```bash
cd backend
npm install @afipsdk/afip.js
```

#### 5. Probar Facturación
- Crear una venta en el sistema
- Verificar que cliente tenga CUIT/CUIL
- El sistema generará factura automáticamente
- Revisar CAE y QR generados

---

### 🚀 FASE 4: Producción (CUANDO TODO FUNCIONE)

#### 1. Mercado Pago en Producción
```env
# Reemplazar credenciales de testing por producción
MERCADOPAGO_ACCESS_TOKEN=APP_USR-1234567890-123456-abc123def456-abc123def456
MERCADOPAGO_PUBLIC_KEY=APP_USR-abc123-def456-789012-abc123def456
```

#### 2. AFIP en Producción
```env
AFIP_ENVIRONMENT=production
AFIP_CERT_PATH=./certs/production/certificate.crt
AFIP_KEY_PATH=./certs/production/private_key.key
```

#### 3. Configurar Webhook en Mercado Pago
- En tu aplicación de Mercado Pago
- Ir a **"Webhooks"**
- Agregar URL: `https://tu-dominio.com/api/payments/webhook`

#### 4. Actualizar URLs
```env
FRONTEND_URL=https://tu-dominio.com
MERCADOPAGO_SUCCESS_URL=https://tu-dominio.com/ventas/payment-success
MERCADOPAGO_WEBHOOK_URL=https://tu-dominio.com/api/payments/webhook
```

---

## ✅ Checklist de Verificación

### Testing
- [ ] Cuenta de Mercado Pago creada
- [ ] Credenciales de testing obtenidas
- [ ] .env configurado
- [ ] Dependencias instaladas
- [ ] Pago de prueba exitoso

### AFIP Testing
- [ ] Punto de venta habilitado
- [ ] Certificado de testing obtenido
- [ ] Archivos en carpeta testing/
- [ ] Primera factura de prueba exitosa
- [ ] CAE y QR generados correctamente

### Producción
- [ ] Testing completado exitosamente
- [ ] Credenciales de producción obtenidas
- [ ] Certificado de producción instalado
- [ ] Webhooks configurados
- [ ] URLs de producción actualizadas
- [ ] Primera factura real exitosa

---

## 📞 Soporte

### Si algo no funciona:

1. **Revisar logs**:
   ```bash
   cd backend
   npm run dev
   # Ver errores en consola
   ```

2. **Verificar configuración**:
   ```bash
   # Ver si las variables están configuradas
   cat .env | grep AFIP
   cat .env | grep MERCADOPAGO
   ```

3. **Verificar certificados**:
   ```bash
   # Verificar que existan
   ls -la certs/testing/
   ls -la certs/production/
   ```

4. **Consultar documentación**:
   - AFIP: https://www.afip.gob.ar/ws/documentacion/
   - Mercado Pago: https://www.mercadopago.com.ar/developers/es/docs

---

## 💡 Consejos

✅ **Empezar por Mercado Pago** (más fácil y rápido)
✅ **Probar en testing antes de producción**
✅ **Guardar credenciales en lugar seguro**
✅ **Hacer backup de certificados**
✅ **Monitorear fecha de vencimiento de certificados**

---

## 🎯 Resumen de Prioridades

### 1️⃣ **Inmediato** (si quieren cobros online):
- Mercado Pago Testing → 30 minutos

### 2️⃣ **Corto Plazo** (1-2 semanas):
- Tramitar AFIP Testing
- Probar facturación

### 3️⃣ **Cuando esté probado**:
- Activar producción
- Configurar webhooks
- Primera factura real

---

## 🔒 Seguridad

⚠️ **IMPORTANTE**:
- NUNCA subir .env a GitHub
- NUNCA compartir certificados por email
- Renovar certificados antes del vencimiento
- Usar HTTPS en producción
- Monitorear logs de transacciones

---

## 📚 Archivos de Referencia

```
backend/
├── .env.example                       # Plantilla de configuración
├── certs/
│   ├── testing/README.md              # Guía certificados testing
│   └── production/README.md           # Guía certificados producción
├── src/
│   └── config/
│       ├── afip.config.ts             # Configuración AFIP
│       └── mercadopago.config.ts      # Configuración MP
└── INTEGRACION-AFIP-MERCADOPAGO.md   # Guía técnica completa

ACTIVACION.md                          # Este archivo
```

---

## ✨ Todo Listo

El sistema está **100% preparado** para cuando quieras activar:
- ✅ Facturación electrónica AFIP
- ✅ Cobros con Mercado Pago
- ✅ Webhooks y notificaciones
- ✅ Generación de PDF
- ✅ Códigos QR

Solo faltan las credenciales y certificados. **¡Suerte!** 🚀
