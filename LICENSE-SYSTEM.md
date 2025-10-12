# Sistema de Licencias - EXMC Sistema

## 📋 Descripción

Sistema EXMC ahora incluye un sistema de licencias profesional con:
- **Período de prueba de 15 días** sin necesidad de código
- **Códigos de activación** personalizados por máquina
- **Validación segura** basada en ID único de máquina
- **Almacenamiento encriptado** de licencias

## 🔑 Cómo Funciona

### Para el Usuario Final:

1. **Primera vez:**
   - Al instalar y abrir la aplicación, aparece una ventana de activación
   - Puede elegir entre:
     - Iniciar período de prueba de 15 días (gratis)
     - Ingresar un código de activación (comprado al desarrollador)

2. **Período de Prueba:**
   - 15 días completamente funcional
   - Al expirar, debe comprar una licencia

3. **Activación:**
   - El usuario copia su "Machine ID" mostrado en la ventana
   - Te envía ese ID por WhatsApp o Instagram
   - Tú generas un código y se lo envías
   - Ingresa el código y su licencia queda activada

### Para Ti (Desarrollador):

## 🛠️ Generar Códigos de Activación

### Paso 1: El Cliente te envía su Machine ID

Cuando un cliente quiere comprar una licencia, debe:
1. Abrir la aplicación
2. Ir a la pestaña "Activar"
3. Copiar el "Machine ID" que aparece
4. Enviártelo por WhatsApp o Instagram

### Paso 2: Generar el Código

Abre una terminal en la carpeta del proyecto y ejecuta:

\`\`\`bash
cd electron
node generate-license.js <MACHINE_ID> [DIAS_VALIDEZ]
\`\`\`

**Ejemplos:**

\`\`\`bash
# Licencia de 1 año (365 días)
node generate-license.js abc123def456 365

# Licencia de 1 mes (30 días)
node generate-license.js abc123def456 30

# Licencia de 10 años
node generate-license.js abc123def456 3650
\`\`\`

El script mostrará:
\`\`\`
╔════════════════════════════════════════════╗
║        CÓDIGO DE ACTIVACIÓN GENERADO       ║
╠════════════════════════════════════════════╣
║          A1B2-C3D4-E5F6-G7H8          ║
╚════════════════════════════════════════════╝
\`\`\`

### Paso 3: Enviar el Código al Cliente

Envía el código generado al cliente. Él debe:
1. Abrir la aplicación
2. Ir a "Activar"
3. Ingresar el código: `A1B2-C3D4-E5F6-G7H8`
4. Click en "Activar Licencia"

¡Listo! Su licencia queda activada.

## 💰 Precios Sugeridos

Puedes definir tus propios precios. Aquí algunas sugerencias:

- **Período de Prueba:** Gratis (15 días)
- **1 Mes:** $500 ARS / $5 USD
- **3 Meses:** $1,200 ARS / $12 USD
- **6 Meses:** $2,000 ARS / $20 USD
- **1 Año:** $3,500 ARS / $35 USD
- **Licencia Perpetua (10 años):** $10,000 ARS / $100 USD

## 🔒 Seguridad

- Cada código está vinculado al Machine ID único del cliente
- Un código NO funciona en otra computadora
- Los códigos son encriptados con HMAC-SHA256
- La información se guarda encriptada en el disco del cliente

## ⚙️ Configuración Avanzada

### Cambiar la Clave Secreta

Por seguridad, debes cambiar la clave secreta antes de distribuir:

1. Abre `electron/license.js`
2. Cambia esta línea:
\`\`\`javascript
const SECRET_KEY = 'EXMC-2025-SECRET-KEY-CHANGE-THIS';
\`\`\`

3. Abre `electron/generate-license.js`
4. Cambia la misma línea:
\`\`\`javascript
const SECRET_KEY = 'EXMC-2025-SECRET-KEY-CHANGE-THIS';
\`\`\`

⚠️ **IMPORTANTE:** Ambas claves deben ser IGUALES. Si cambias una y la otra no, los códigos no funcionarán.

### Saltar Verificación en Desarrollo

El sistema automáticamente salta la verificación de licencia cuando ejecutas en modo desarrollo (`npm run electron:dev`).

## 📞 Soporte a Clientes

Cuando un cliente tenga problemas:

1. **"No puedo activar mi código"**
   - Verifica que el código fue generado para SU Machine ID
   - Asegúrate que copió el código correctamente (con guiones)

2. **"Mi prueba expiró"**
   - Genera un código de activación para su máquina
   - O explícale cómo comprar una licencia

3. **"Cambié de PC"**
   - El código anterior NO funcionará
   - Necesita un nuevo código para la nueva máquina
   - Puedes cobrar un fee por transferencia o dar uno gratis (tú decides)

## 🎯 Comandos Útiles

\`\`\`bash
# Ver información de un cliente
node generate-license.js <MACHINE_ID> 365

# Generar múltiples códigos de diferentes duraciones
node generate-license.js <MACHINE_ID> 30    # 1 mes
node generate-license.js <MACHINE_ID> 365   # 1 año
node generate-license.js <MACHINE_ID> 3650  # 10 años
\`\`\`

## 📝 Notas

- Los clientes verán advertencias cuando queden 7 días o menos de licencia
- El sistema es compatible con todas las versiones de Windows
- No requiere conexión a internet para funcionar
- Los códigos nunca expiran mientras no se use la aplicación

## 🚀 Compilar Versión con Licencias

Para compilar el instalador con el sistema de licencias:

\`\`\`bash
npm run build:all
npm run electron:build:win
\`\`\`

El instalador generado incluirá todo el sistema de licencias automáticamente.

---

**Desarrollador:** Luciano Savoretti (@devpuchito)  
**Contacto:** +54 2657580979
