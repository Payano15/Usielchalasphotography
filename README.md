# Usielchalasphotography

Una página web moderna y responsive para mostrar el portafolio de un fotógrafo, con galería de fotos y enlaces a redes sociales.

## Características

- 🎨 Diseño moderno y responsive con Bootstrap 5
- 📸 Galería de fotos con filtros por categoría
- 🗄️ Base de datos MySQL para almacenar información de fotos
- 📱 Compatible con dispositivos móviles
- 🔗 Enlaces a redes sociales (Facebook, Instagram, TikTok, WhatsApp)
- ⚡ Carga dinámica de fotos desde la base de datos
- 🎭 Modal para ver fotos en tamaño completo
- 📤 API REST para subir y gestionar fotos

## Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Base de Datos:** MySQL
- **Iconos:** Font Awesome

## Instalación

### Prerrequisitos

1. **Node.js** (versión 14 o superior)
2. **MySQL** (versión 5.7 o superior)
3. **Git** (opcional)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <url-del-repositorio>
   cd "usielchalasphotography"
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos MySQL**
   
   a. Crear una base de datos:
   ```sql
   CREATE DATABASE fotografo_db;
   ```
   
   b. Editar la configuración en `server/config/database.js`:
   ```javascript
   const dbConfig = {
     host: 'localhost',
     user: 'tu_usuario',        // Cambia por tu usuario de MySQL
     password: 'tu_password',   // Cambia por tu contraseña de MySQL
     database: 'fotografo_db',
     port: 3306
   };
   ```

4. **Iniciar el servidor**
   ```bash
   npm start
   ```
   
   O para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

5. **Acceder a la página**
   
   Abre tu navegador y ve a: `http://localhost:3000`

## Estructura del Proyecto

```
usielchalasphotography/
├── public/                 # Archivos estáticos
│   ├── css/
│   │   └── styles.css     # Estilos personalizados
│   ├── js/
│   │   └── main.js        # JavaScript del frontend
│   ├── images/            # Imágenes estáticas
│   └── uploads/           # Fotos subidas por usuarios
├── views/
│   └── index.html         # Página principal
├── server/
│   ├── config/
│   │   └── database.js    # Configuración de MySQL
│   ├── routes/
│   │   └── photos.js      # Rutas de la API
│   └── server.js          # Servidor principal
├── package.json           # Dependencias del proyecto
└── README.md             # Este archivo
```

## Uso

### Agregar Fotos

1. **A través de la API** (para desarrolladores):
   ```bash
   curl -X POST http://localhost:3000/api/photos \
     -F "photo=@ruta/a/tu/foto.jpg" \
     -F "title=Título de la foto" \
     -F "description=Descripción de la foto" \
     -F "category=retratos"
   ```

2. **Directamente en la base de datos**:
   ```sql
   INSERT INTO photos (title, description, image_path, category) 
   VALUES ('Mi Foto', 'Descripción', '/uploads/foto.jpg', 'retratos');
   ```

### Categorías de Fotos

Las fotos se pueden categorizar en:
- `retratos`
- `paisajes`
- `eventos`
- `otros` (categoría por defecto)

### Personalización

#### Cambiar Información del Fotógrafo

Edita el archivo `views/index.html`:
- Cambia "Usielchalasphotography" por el nombre real si es necesario
- Actualiza la descripción en la sección hero
- Modifica los enlaces de redes sociales

#### Cambiar Enlaces de Redes Sociales

En `views/index.html`, actualiza los enlaces:
```html
<a href="https://facebook.com/tu-perfil-real" target="_blank">
<a href="https://instagram.com/tu-perfil-real" target="_blank">
<a href="https://tiktok.com/@tu-perfil-real" target="_blank">
<a href="https://wa.me/tu-numero-real" target="_blank">
```

#### Personalizar Colores

Edita `public/css/styles.css` para cambiar:
- Colores del gradiente del hero
- Colores de botones
- Estilos de la galería

## API Endpoints

### GET /api/photos
Obtiene todas las fotos de la galería.

### POST /api/photos
Sube una nueva foto.
- `photo`: Archivo de imagen
- `title`: Título de la foto
- `description`: Descripción (opcional)
- `category`: Categoría (opcional)

### GET /api/photos/:id
Obtiene una foto específica por ID.

### DELETE /api/photos/:id
Elimina una foto por ID.

## Solución de Problemas

### Error de conexión a MySQL
- Verifica que MySQL esté corriendo
- Confirma las credenciales en `server/config/database.js`
- Asegúrate de que la base de datos `fotografo_db` exista

### Error al subir fotos
- Verifica que la carpeta `public/uploads/` tenga permisos de escritura
- Confirma que el archivo sea una imagen válida
- Revisa que el tamaño del archivo no exceda 5MB

### Página no carga
- Verifica que el servidor esté corriendo en el puerto 3000
- Revisa la consola del navegador para errores JavaScript
- Confirma que todas las dependencias estén instaladas

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Si tienes preguntas o necesitas ayuda, no dudes en contactar.

---

¡Disfruta mostrando tu trabajo fotográfico al mundo! 📸✨ 