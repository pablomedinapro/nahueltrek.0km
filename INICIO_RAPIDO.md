# 🚀 Guía Rápida de Inicio - Google Integration

## ⚡ Inicio Rápido (15 minutos)

### Paso 1: Google Cloud Console (5 min)

1. Ve a https://console.cloud.google.com/
2. Clic en "Nuevo proyecto" → Nombre: `nahueltrek-blog`
3. Ir a "APIs y servicios" → "Biblioteca"
4. Buscar y HABILITAR (botón azul):
   - ✅ Google Drive API
   - ✅ Google Sheets API
   - ✅ Google Maps JavaScript API
   - ✅ Geocoding API

### Paso 2: Crear API Key de Maps (2 min)

1. "Credenciales" → "+ CREAR CREDENCIALES" → "Clave de API"
2. Copiar la clave generada (ej: `AIzaSyC8X...`)
3. Clic en el nombre de la clave → Configurar:
   - **Restricciones de API**: Marcar Maps JavaScript API y Geocoding API
   - **Restricciones de aplicación**: HTTP referrers
     - Agregar: `http://localhost:5173/*` y `https://nahueltrek.0km.app/*`
4. GUARDAR

### Paso 3: Crear OAuth Client (3 min)

1. "Pantalla de consentimiento de OAuth" → Externo → CREAR
2. Completar:
   - Nombre: `NahuelTrek Blog`
   - Email: tu@gmail.com
   - Dominios: `0km.app`
3. "GUARDAR Y CONTINUAR" (3 veces)
4. "VOLVER AL PANEL"

5. "Credenciales" → "+ CREAR CREDENCIALES" → "ID de cliente de OAuth 2.0"
6. Tipo: Aplicación web
7. URIs de redirección:
   - `http://localhost:5173`
   - `https://nahueltrek.0km.app`
8. CREAR
9. **DESCARGAR JSON** → Guardar como `credentials.json` en `d:\nahueltrek-source\`

### Paso 4: Crear Recursos Google (5 min)

**Google Drive:**
1. https://drive.google.com/
2. Nueva carpeta → `NahuelTrek-Images`
3. Clic derecho → Compartir → "Cualquier usuario con el enlace" (Lector)
4. Copiar ID de la URL: `https://drive.google.com/drive/folders/[ESTE_ID]`

**Google Sheets - Actividades:**
1. https://sheets.google.com/
2. Hoja en blanco → Nombre: `NahuelTrek-Actividades`
3. En fila 1, escribir estos encabezados:
   ```
   id | titulo | descripcion | duracion | dificultad | precio | incluye | imagen | destacado | fechaCreacion | lugarId
   ```
4. Copiar ID de la URL: `https://docs.google.com/spreadsheets/d/[ESTE_ID]/edit`

**Google Sheets - Lugares:**
1. Hoja en blanco → Nombre: `NahuelTrek-Lugares`
2. En fila 1, escribir:
   ```
   id | titulo | descripcion | ubicacion | contenido | categoria | destacado | imagenes | fechaCreacion | lat | lng
   ```
3. Copiar ID de la URL

**Google Forms (Opcional):**
1. https://forms.google.com/
2. Formulario en blanco → `Reservaciones NahuelTrek`
3. Agregar campos: Actividad, Nombre, Email, Teléfono, Fecha, Personas, Comentarios
4. Copiar URL del formulario publicado

### Paso 5: Configurar .env

Crear archivo `d:\nahueltrek-source\.env`:

```bash
# Copiar de .env.example y completar con tus valores

VITE_GOOGLE_MAPS_API_KEY=AIzaSyC8X...
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-...
VITE_GOOGLE_DRIVE_FOLDER_ID=1ABC...
VITE_GOOGLE_SHEETS_ACTIVIDADES_ID=1XYZ...
VITE_GOOGLE_SHEETS_LUGARES_ID=1DEF...
VITE_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/...
```

**Dónde encontrar cada valor:**
- `CLIENT_ID` y `CLIENT_SECRET`: En el archivo `credentials.json` que descargaste
- `DRIVE_FOLDER_ID`: URL de la carpeta de Drive
- `SHEETS_IDS`: URLs de las hojas de cálculo
- `FORM_URL`: URL del formulario publicado

### Paso 6: Ejecutar App

```bash
cd d:\nahueltrek-source
npm run dev
```

**Primera vez:**
- Te pedirá autorización de Google
- Aceptar todos los permisos
- Redirige automáticamente

**Listo! 🎉**

---

## 🧪 Prueba de Funcionalidades

### 1. Google Drive (Imágenes)
1. Ir al Admin Panel (botón candado, password: `nahueltrek2025`)
2. Crear actividad nueva
3. Subir imagen → Debería ir a Google Drive
4. Verificar en https://drive.google.com/ que apareció en la carpeta

### 2. Google Sheets (Base de Datos)
1. Crear actividad o lugar
2. Ir a las hojas de Google Sheets
3. Verificar que aparece la nueva fila con todos los datos

### 3. Google Maps (Ubicaciones)
1. Ir a "Blog Lugares"
2. Crear lugar nuevo
3. Buscar ubicación en el mapa o hacer clic
4. Arrastrar el marcador
5. Verificar que muestra la dirección
6. Guardar y ver el mapa en la card del lugar

### 4. Google Forms (Reservas)
1. Hacer clic en una actividad (ej: Trekking Nov 15)
2. Clic en botón azul "🎫 Reservar con Google Forms"
3. Verificar que abre el formulario
4. Completar y enviar
5. Verificar que llegó a la hoja de respuestas

---

## ❓ Solución de Problemas

### Error: "Google Drive no configurado"
- ✅ Verifica que `.env` existe (no `.env.example`)
- ✅ Verifica que las variables están completas (sin espacios ni comillas extras)
- ✅ Reinicia el servidor: Ctrl+C y `npm run dev`

### Error: "Autenticación fallida"
- ✅ Verifica que `credentials.json` está en la raíz del proyecto
- ✅ Borra `token.json` si existe y vuelve a autorizar
- ✅ Verifica que agregaste los URIs de redirección correctos

### Imágenes no se ven de Drive
- ✅ Verifica que la carpeta de Drive es pública (anyone with link)
- ✅ Abre una imagen directamente en el navegador para verificar permisos

### Google Sheets no actualiza
- ✅ Verifica los IDs de las hojas en `.env`
- ✅ Verifica que los encabezados coinciden exactamente (mayúsculas/minúsculas)
- ✅ Abre la consola del navegador (F12) para ver errores

### Google Maps no se muestra
- ✅ Verifica la API Key en `.env`
- ✅ Verifica que habilitaste Maps JavaScript API y Geocoding API
- ✅ Verifica restricciones de la API Key (debe incluir tu dominio)

---

## 📚 Más Info

- **Documentación completa**: `GOOGLE_INTEGRATION.md` (621 líneas)
- **Resumen técnico**: `IMPLEMENTACION_GOOGLE.md`
- **Código fuente**: 
  - `src/services/DriveService.js`
  - `src/services/SheetsService.js`
  - `src/components/MapPicker.jsx`
  - `src/components/MapDisplay.jsx`

---

## 🎯 Checklist Final

Antes de desplegar a producción, verifica:

- [ ] Todas las variables en `.env` están completas
- [ ] `credentials.json` está en `.gitignore` (NO subirlo a GitHub)
- [ ] Probaste subir imagen a Drive
- [ ] Probaste crear/editar en Sheets
- [ ] Probaste el mapa y selector de ubicación
- [ ] Probaste el formulario de reservas
- [ ] Build compila sin errores: `npm run build`
- [ ] Actualizaste URLs en Google Cloud Console para producción

---

**¿Todo listo? ¡Ahora tienes un blog profesional con 0 dependencias de PHP! 🚀**

**Siguiente:** Leer `GOOGLE_INTEGRATION.md` sección "Despliegue en Producción"
