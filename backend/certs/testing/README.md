# 📁 Directorio de Certificados AFIP

## 📋 Instrucciones

Este directorio debe contener los certificados digitales de AFIP para **TESTING**.

### Archivos Necesarios:

```
testing/
├── certificate.crt    ← Certificado digital de AFIP
└── private_key.key    ← Clave privada
```

---

## 🔐 Cómo Obtener los Certificados (Ambiente de Testing)

### 1. Generar CSR (Certificate Signing Request)

```bash
# En Linux/Mac:
openssl req -new -newkey rsa:2048 -nodes \
  -keyout private_key.key \
  -out certificate.csr \
  -subj "/C=AR/O=TuEmpresa/CN=testing"

# En Windows (con Git Bash o WSL):
openssl req -new -newkey rsa:2048 -nodes -keyout private_key.key -out certificate.csr -subj "/C=AR/O=TuEmpresa/CN=testing"
```

### 2. Solicitar Certificado en AFIP

1. Ingresar a: https://www.afip.gob.ar/ws/WSASS/
2. Ir a **"Administrador de Relaciones"**
3. Seleccionar **"Solicitar Certificado"**
4. Subir el archivo `certificate.csr`
5. Seleccionar **"Webservices de Facturación Electrónica"**
6. Descargar el certificado (.crt)

### 3. Colocar Archivos Aquí

- Copiar `certificate.crt` a esta carpeta
- Copiar `private_key.key` a esta carpeta

### 4. Configurar .env

```env
AFIP_CERT_PATH=./certs/testing/certificate.crt
AFIP_KEY_PATH=./certs/testing/private_key.key
AFIP_ENVIRONMENT=testing
```

---

## ⚠️ Importante

- ✅ Los archivos .crt y .key están en .gitignore (no se suben a GitHub)
- ✅ Este ambiente es solo para pruebas
- ✅ Las facturas generadas aquí NO son válidas legalmente
- ✅ Validez del certificado: 6-12 meses (renovar periódicamente)

---

## 🔗 Enlaces Útiles

- **AFIP Homologación**: http://wswhomo.afip.gov.ar/
- **Guía Oficial**: https://www.afip.gob.ar/ws/documentacion/
- **Web Services**: https://www.afip.gob.ar/ws/WSASS/

---

## 📞 Soporte

Si necesitas ayuda:
1. Consultar documentación de AFIP
2. Contactar al desarrollador del sistema
3. Revisar logs en `backend/logs/afip.log`
