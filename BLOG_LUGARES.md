# Sistema de Blog de Lugares - Nahueltrek

## 📍 Características

El sistema de blog de lugares permite gestionar contenido sobre destinos y lugares de interés para actividades de trekking y aventura. **Incluye relación con actividades**.

### Funcionalidades:

1. **CRUD Completo**:
   - Agregar nuevos lugares
   - Editar lugares existentes
   - Eliminar lugares
   - Visualización en lista y tarjetas

2. **Campos del Lugar**:
   - Título
   - Descripción corta
   - Ubicación (región/provincia)
   - Contenido completo (artículo de blog)
   - Categoría (trekking, camping, escalada, naturaleza, aventura, cultura)
   - Marcador de "Destacado"
   - 3 imágenes por lugar
   - Fecha de publicación automática

3. **Relación Lugares-Actividades** ⭐ NUEVO:
   - Cada actividad puede asociarse a un lugar específico
   - Campo `lugarId` en actividades
   - Selector dropdown en el formulario de actividades
   - Visualización del lugar en las tarjetas de actividades
   - Contador de actividades en cada tarjeta de lugar
   - Badge informativo mostrando el nombre del lugar

4. **Características Visuales**:
   - Lugares destacados aparecen primero con badge especial ⭐
   - Tarjetas con efecto hover
   - Imágenes con zoom al pasar el mouse
   - Badge de categoría
   - Contador "🥾 X actividades" en tarjetas de lugares
   - Badge "🗺️ Nombre del Lugar" en tarjetas de actividades
   - Botón "Leer más" para ver contenido completo
   - Diseño responsive

## 🔧 Archivos Creados

### Frontend:
- `src/components/BlogLugares.jsx` - Componente de gestión de lugares

### Backend:
- `api/lugares.php` - Endpoint REST para CRUD de lugares
- `data/lugares.json` - Almacenamiento de datos

### Integración:
- Modificaciones en `src/App.jsx`:
  - Import de componente BlogLugares
  - Estados: `lugares`, `blogAbierto`, `cargandoLugares`
  - Función `cerrarBlog()`
  - Sección visual en la página principal (id="lugares")
  - Link en menú desktop y mobile
  - Botón "📍 Blog Lugares" en navbar (solo visible cuando autenticado)
  - **Relación lugares-actividades**: Badge con nombre del lugar en tarjetas de actividades
  - **Contador de actividades**: Muestra cantidad de actividades por lugar

- Modificaciones en `src/components/Admin.jsx`:
  - Prop adicional: `lugares` (array de lugares disponibles)
  - Campo `lugarId` en formulario de actividades
  - Selector dropdown para elegir lugar
  - Validación: muestra advertencia si no hay lugares creados
  - Badge informativo en tarjetas mostrando el lugar asociado
  - Campo `lugarId` incluido en estados de edición y reset

## 🚀 Uso

### Para Administradores:

#### Gestión de Lugares:

1. **Acceder al panel**:
   - Login con contraseña (nahueltrek2025)
   - Click en botón "📍 Blog Lugares" en la barra superior

2. **Agregar lugar**:
   - Completar formulario con título y descripción (obligatorios)
   - Agregar ubicación, categoría y contenido
   - Subir hasta 3 imágenes (JPG/PNG/WEBP, máx 2MB cada una)
   - Marcar como destacado si corresponde
   - Click en "➕ Agregar Lugar"

3. **Editar lugar**:
   - En la lista, click en "✏️ Editar"
   - Modificar campos necesarios
   - Click en "💾 Guardar Cambios"

4. **Eliminar lugar**:
   - En la lista, click en "🗑️"
   - Confirmar eliminación

#### Asociar Lugares con Actividades:

1. **Al crear/editar una actividad**:
   - Abrir Panel Admin (🔧 Admin)
   - Completar datos de la actividad (fecha, título, etc.)
   - En el campo "📍 Lugar/Destino", seleccionar un lugar del dropdown
   - Si no hay lugares, aparecerá advertencia para crearlos primero
   - Guardar la actividad

2. **Visualización**:
   - Las actividades mostrarán badge "🗺️ Nombre del Lugar"
   - Los lugares mostrarán contador "🥾 X actividades"
   - Relación visible tanto en admin como en página pública

### Para Visitantes:

1. Ver lugares en la sección "Lugares que Debes Conocer" (id="#lugares")
2. Los lugares destacados aparecen primero
3. Click en "Leer más" para ver contenido completo
4. Filtrado por categoría visible en badges

## 📦 API Endpoints

### GET /api/lugares.php
Retorna todos los lugares publicados
```json
[
  {
    "id": 1234567890,
    "titulo": "Parque Nacional Nahuelbuta",
    "descripcion": "Bosque de araucarias milenarias",
    "ubicacion": "Región de La Araucanía",
    "contenido": "Artículo completo...",
    "categoria": "trekking",
    "destacado": true,
    "imagenes": ["url1", "url2", "url3"],
    "fechaPublicacion": "2025-11-16T..."
  }
]
```

### POST /api/lugares.php
Guarda el array completo de lugares
```json
[...lugares...]
```

## 🎨 Categorías Disponibles

- 🥾 Trekking
- ⛺ Camping
- 🧗 Escalada
- 🌲 Naturaleza
- 🏔️ Aventura
- 🏛️ Cultura

## 🔒 Seguridad

- Panel de administración requiere autenticación
- Validación de tamaño de archivos (2MB máx)
- Validación de tipos de archivo (JPG/PNG/WEBP)
- Sistema de blog solo visible para administradores autenticados

## 📱 Responsive Design

El sistema es completamente responsive:
- Desktop: Grid de 3 columnas
- Tablet: Grid de 2 columnas
- Mobile: 1 columna

## 🚀 Deployment

Los archivos a subir al servidor:
1. `api/lugares.php` → `public_html/api/`
2. Crear directorio `data/` con permisos 755
3. Crear archivo `data/lugares.json` con `[]` inicial
4. Los archivos dist/ ya incluyen el código compilado
