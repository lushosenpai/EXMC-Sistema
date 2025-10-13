# ⚠️ IMPORTANTE: Windows Defender y Firewall

## 🛡️ Windows Defender detecta el instalador como amenaza

**Esto es NORMAL y ocurre porque:**
- El ejecutable no está firmado digitalmente (certificado de código cuesta USD $400+/año)
- Incluye PostgreSQL portable y un servidor backend
- Es una aplicación nueva sin "reputación" en Microsoft SmartScreen

## ✅ El sistema es 100% SEGURO

**Código fuente público:**
- https://github.com/lushosenpai/EXMC-Sistema
- Puedes revisar todo el código antes de instalarlo

**Desarrollador verificable:**
- Instagram: [@devpuchito](https://instagram.com/devpuchito)
- WhatsApp: +54 2657580979

---

## 📥 Cómo instalar (paso a paso)

### 1️⃣ Descargar el instalador
Descarga `Sistema EXMC-Setup-2.0.0.exe` desde:
https://github.com/lushosenpai/EXMC-Sistema/releases/tag/v2.0.0

### 2️⃣ Permitir la instalación

**Si Windows Defender bloquea el archivo:**

1. Haz clic en **"Más información"**
2. Haz clic en **"Ejecutar de todas formas"**

**Si no ves "Ejecutar de todas formas":**

1. Abre **Windows Security** (Seguridad de Windows)
2. Ve a **Protección contra virus y amenazas**
3. En **Historial de protección**, busca el archivo bloqueado
4. Haz clic en **"Permitir en el dispositivo"**

### 3️⃣ Permitir acceso a la red

Durante la primera ejecución, Windows Firewall mostrará un mensaje:

```
Windows Defender Firewall ha bloqueado algunas características de esta aplicación
```

**Debes hacer clic en "Permitir acceso"** para:
- ✅ Redes privadas (recomendado)
- ❌ Redes públicas (NO necesario)

El sistema necesita acceso a la red para:
- Backend API (puerto 3001)
- PostgreSQL (puerto 5433)
- Comunicación entre Electron y el servidor local

---

## 🔧 Problemas comunes

### ❌ "No se puede conectar al servidor"
**Causa:** El firewall bloqueó los puertos.

**Solución:**
1. Abre el sistema una segunda vez
2. Ahora SÍ debe aparecer el popup del firewall
3. Haz clic en "Permitir acceso"

### ❌ El instalador agrega las reglas automáticamente
**El instalador NSIS del Build #19 incluye:**
```
netsh advfirewall firewall add rule name="Sistema EXMC"...
```

Esto crea reglas automáticamente para:
- Sistema EXMC.exe
- Puerto 3001 (Backend)
- Puerto 5433 (PostgreSQL)

### ❌ "Credenciales inválidas"
**Esto ocurría en Build #18 (corregido en Build #19)**

**Credenciales correctas:**
- Admin: `admin@exmc.com` / `admin123`
- Vendedor: `vendedor@exmc.com` / `admin123`
- Consulta: `consulta@exmc.com` / `admin123`

---

## 🚀 Build #19 - Correcciones

✅ **Usuario admin agregado al seed** (faltaba en Build #18)
✅ **Reglas de firewall automáticas** (no más popups bloqueantes)
✅ **Mejor manejo de errores** en activación de licencias
✅ **Logs mejorados** para debugging

---

## 📞 ¿Necesitas ayuda?

**Instagram:** [@devpuchito](https://instagram.com/devpuchito)  
**WhatsApp:** [+54 2657580979](https://wa.me/5492657580979?text=Hola!%20Consulta%20sobre%20Sistema%20EXMC)

---

## 🔐 ¿Por qué no está firmado digitalmente?

**Certificados de firma de código cuestan:**
- Certificado EV (Extended Validation): USD $400-600 por año
- Requiere validación empresarial completa
- Proceso de 1-2 semanas

**Para proyectos open source es prohibitivo**, por eso muchos desarrolladores indie publican sin firmar.

**Alternativa:** Puedes compilar el código tú mismo siguiendo `INSTALACION.md`

---

*Desarrollado por Luciano Savoretti (@devpuchito) - Dev/Sistemas/Web*
