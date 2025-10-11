# 🎨 Guía para Crear Íconos para Electron

## 📋 Íconos Necesarios

Tu aplicación Electron necesita 3 tipos de íconos:

1. **icon.png** - Ícono de la ventana (256x256)
2. **icon.ico** - Ícono del instalador Windows (multi-resolución)
3. **tray-icon.png** - Ícono de bandeja del sistema (16x16)

---

## 🎯 Opción 1: Usar el Logo EXMC Actual

Ya tienes `frontend/src/assets/EXMC.svg`, vamos a convertirlo:

### Paso 1: Convertir SVG a PNG

**Online (Recomendado):**
1. Ve a: https://svgtopng.com/
2. Sube: `frontend/src/assets/EXMC.svg`
3. Selecciona tamaño: **256x256 px**
4. Descarga el PNG
5. Guarda como: `electron/assets/icon.png`

**Con Inkscape (si lo tienes instalado):**
```bash
inkscape frontend/src/assets/EXMC.svg --export-png=electron/assets/icon.png --export-width=256 --export-height=256
```

### Paso 2: Convertir PNG a ICO

**Online (Recomendado):**
1. Ve a: https://convertio.co/es/png-ico/
2. Sube el `icon.png` que generaste
3. Asegúrate de que incluya múltiples resoluciones:
   - 16x16
   - 32x32
   - 48x48
   - 64x64
   - 128x128
   - 256x256
4. Descarga el ICO
5. Guarda como: `electron/assets/icon.ico`

**Con ImageMagick (si lo tienes instalado):**
```bash
magick convert electron/assets/icon.png -define icon:auto-resize=256,128,64,48,32,16 electron/assets/icon.ico
```

### Paso 3: Crear Ícono de Bandeja (Tray)

**Online:**
1. Ve a: https://www.iloveimg.com/resize-image
2. Sube: `icon.png`
3. Redimensiona a: **16x16 px**
4. Descarga
5. Guarda como: `electron/assets/tray-icon.png`

**Con PowerShell (Windows):**
```powershell
# Usar Paint o cualquier editor para redimensionar a 16x16
# O usar este script de PowerShell
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("$PWD\electron\assets\icon.png")
$resized = New-Object System.Drawing.Bitmap(16, 16)
$graphics = [System.Drawing.Graphics]::FromImage($resized)
$graphics.DrawImage($img, 0, 0, 16, 16)
$resized.Save("$PWD\electron\assets\tray-icon.png")
$graphics.Dispose()
$resized.Dispose()
$img.Dispose()
```

---

## 🎯 Opción 2: Crear Íconos Personalizados

Si quieres crear íconos desde cero:

### Herramientas Recomendadas:

**Gratuitas:**
- **Figma** (online): https://www.figma.com/
- **Canva** (online): https://www.canva.com/
- **GIMP** (desktop): https://www.gimp.org/
- **Paint.NET** (Windows): https://www.getpaint.net/

**De pago:**
- **Adobe Illustrator**
- **Affinity Designer**

### Especificaciones:

**icon.png (Ventana):**
- Tamaño: 256x256 px
- Formato: PNG con transparencia
- Colores: RGB
- Fondo: Transparente
- Peso: < 100 KB

**icon.ico (Instalador):**
- Tamaño: Multi-resolución (16, 32, 48, 64, 128, 256)
- Formato: ICO
- Incluye todas las resoluciones en un solo archivo
- Peso: < 200 KB

**tray-icon.png (Bandeja):**
- Tamaño: 16x16 px
- Formato: PNG con transparencia
- Colores: RGB o Monocromático
- Peso: < 10 KB
- **Importante:** Debe verse bien en fondo claro y oscuro

---

## 🚀 Script Automático (Próximamente)

Voy a crear un script que automatice todo:

```bash
npm run generate:icons
```

Este script:
1. Toma el SVG original
2. Genera todos los PNG necesarios
3. Convierte PNG a ICO
4. Optimiza las imágenes
5. Las coloca en `electron/assets/`

---

## ✅ Verificar que Funcionan

Una vez que tengas los íconos:

```bash
# Verificar que existen
dir electron\assets

# Deben aparecer:
# icon.png (256x256)
# icon.ico (multi-resolución)
# tray-icon.png (16x16)

# Probar la app
npm run electron:dev
```

La ventana debe mostrar tu ícono personalizado.

---

## 📐 Plantilla de Diseño

Si estás diseñando desde cero, usa esta guía:

```
┌─────────────────────────┐
│                         │
│    [LOGO PRINCIPAL]     │  ← Debe ocupar 70-80% del espacio
│                         │
│    E X M C             │  ← Texto opcional
│                         │
└─────────────────────────┘

Colores recomendados:
- Primario: #3b82f6 (azul EXMC)
- Secundario: #0f172a (fondo oscuro)
- Acento: #60a5fa (azul claro)

Estilo:
- Minimalista
- Formas geométricas simples
- Sin degradados complejos (para mejor visualización en 16x16)
- Buen contraste
```

---

## 🎨 Alternativa: Usar Logo Actual Temporalmente

Si no tienes tiempo para crear íconos ahora, puedo generar íconos temporales con el logo EXMC actual.

Ejecuta estos comandos para copiar el logo actual:

```bash
# Copiar logo a assets (temporal)
copy frontend\src\assets\EXMC.svg electron\assets\icon.svg

# Luego necesitarás convertir manualmente SVG → PNG → ICO
# Usando las herramientas online mencionadas arriba
```

---

## 📞 ¿Necesitas Ayuda?

Si necesitas ayuda para:
- Diseñar los íconos
- Convertir formatos
- Optimizar las imágenes

Puedo guiarte paso a paso. ¿En qué parte necesitas más ayuda?
