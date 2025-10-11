# 📁 Directorio de Certificados AFIP - PRODUCCIÓN

## ⚠️ IMPORTANTE - AMBIENTE DE PRODUCCIÓN

Este directorio contiene los certificados REALES de AFIP para facturación en producción.

### Archivos Necesarios:

```
production/
├── certificate.crt    ← Certificado digital de AFIP PRODUCCIÓN
└── private_key.key    ← Clave privada PRODUCCIÓN
```

---

## 🔐 Cómo Obtener los Certificados (Producción)

### 1. Requisitos Previos

- ✅ CUIT de la empresa
- ✅ Clave Fiscal nivel 3 o superior
- ✅ Punto de venta habilitado en AFIP
- ✅ Haber probado exitosamente en Testing

### 2. Generar CSR

```bash
openssl req -new -newkey rsa:2048 -nodes \
  -keyout private_key.key \
  -out certificate.csr \
  -subj "/C=AR/O=TuEmpresa/CN=wsfe"
```

### 3. Solicitar Certificado en AFIP

1. Ingresar a: https://www.afip.gob.ar/ con Clave Fiscal
2. **"Administrador de Relaciones de Clave Fiscal"**
3. **"Nueva Relación"** o **"Modificar Relación"**
4. Buscar: **"Webservices de Facturación Electrónica"**
5. Subir el CSR generado
6. Esperar aprobación (puede tomar horas/días)
7. Descargar certificado .crt

### 4. Configurar .env

```env
AFIP_CERT_PATH=./certs/production/certificate.crt
AFIP_KEY_PATH=./certs/production/private_key.key
AFIP_ENVIRONMENT=production
AFIP_CUIT=20123456789  # Tu CUIT real
AFIP_PUNTO_VENTA=1     # Tu punto de venta real
```

---

## 🚨 SEGURIDAD CRÍTICA

### ⛔ NO HACER:
- ❌ Subir estos archivos a GitHub
- ❌ Compartir por email sin cifrar
- ❌ Dejar en directorios públicos
- ❌ Usar certificados vencidos

### ✅ SÍ HACER:
- ✅ Mantener archivos en servidor seguro
- ✅ Permisos 600 (solo lectura del usuario)
- ✅ Backup cifrado en lugar seguro
- ✅ Renovar antes del vencimiento
- ✅ Monitorear fecha de expiración

---

## 📅 Renovación

Los certificados vencen cada **6-12 meses**. 

### Proceso de Renovación:
1. Generar nuevo CSR
2. Solicitar nuevo certificado en AFIP
3. Reemplazar archivos antiguos
4. Reiniciar servidor
5. Verificar primera factura

### Alertas Automáticas:
El sistema alertará 30 días antes del vencimiento.

---

## 🔒 Permisos Recomendados

```bash
chmod 600 certificate.crt
chmod 600 private_key.key
chown www-data:www-data *.crt *.key
```

---

## 📊 Verificación

### Comando para ver info del certificado:
```bash
openssl x509 -in certificate.crt -text -noout
```

### Verificar fecha de vencimiento:
```bash
openssl x509 -in certificate.crt -noout -dates
```

---

## 🆘 En Caso de Compromiso

Si sospechas que la clave privada fue comprometida:

1. **INMEDIATO**: Revocar certificado en AFIP
2. Generar nuevos certificados
3. Actualizar en el sistema
4. Notificar al soporte de AFIP
5. Auditar facturas emitidas durante el período

---

## 🔗 Enlaces de Producción

- **AFIP Producción**: https://servicios1.afip.gov.ar/
- **Administrador**: https://auth.afip.gob.ar/
- **Consultas**: https://www.afip.gob.ar/sitio/externos/default.asp

---

## ⚖️ Legal

Las facturas generadas con estos certificados tienen validez fiscal y legal.
Asegurarse de cumplir con todas las regulaciones de AFIP.
