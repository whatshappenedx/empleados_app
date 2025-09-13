**Empleados App — Backend PHP sin Framework+ Frontend Angular**


**Requisitos**  
- **PHP** 8.1+
- **Node.js** 18+
- **MySQL/MariaDB** 10.4+


**Configuración Rápida**
- **Configurar DB:** editar `backend/src/config.php:6` con host, puerto, nombre, usuario y contraseña.
- **Crear BD y tablas:**
  - Crear base: `CREATE DATABASE empresa_db CHARACTER SET utf8mb4;` (o el nombre que definas)
  - Importar esquema y datos: `mysql -u <user> -p <db> < database/schema.sql`
- **Token API (seguridad):** en `backend/src/config.php:12` cambia `API_TOKEN` por un valor seguro.

**Levantar Backend (PHP)**
- Servidor embebido:
  - `php -S localhost:8000 -t backend/public`
  - Verifica: `curl http://localhost:8000/` debe responder con `API empleados OK`.

**Levantar Frontend (Angular)**
- `cd frontend/angular`
- `npm install`
- `npm start` (abre en `http://localhost:4200`)
- El frontend llama por defecto a `http://localhost:8000` y usa un token por defecto.

**Probar con Postman**
- Importa `postman/empleados_api.postman_collection.json`.
- Variables de la colección:
  - `baseUrl`: `http://localhost:8000`
  - `apiToken`: el valor de `API_TOKEN` en `backend/src/config.php`

**Endpoints**
- Empleados
  - `GET /api/empleados`: lista con paginación y búsqueda (`page`, `limit`, `q`)
  - `GET /api/empleados/{id}`: detalle
  - `POST /api/empleados` (token): crear
  - `PUT /api/empleados/{id}` (token): actualizar
  - `DELETE /api/empleados/{id}` (token): eliminar
- Familiares
  - `GET /api/empleados/{id}/familiares`: listar familiares por empleado
  - `POST /api/empleados/{id}/familiares` (token): agregar familiar
  - `DELETE /api/familiares/{id}` (token): eliminar familiar

**Ejemplos cURL**
- Listar (público):
  - `curl "http://localhost:8000/api/empleados?page=1&limit=10&q=ana"`
- Crear empleado (requiere token):
  - `curl -X POST http://localhost:8000/api/empleados -H "Content-Type: application/json" -H "Authorization: Bearer <API_TOKEN>" -d '{"nombre":"Nuevo","correo":"nuevo@example.com","cargo":"QA","fecha_ingreso":"2024-01-10"}'`

**Base de Datos**
- Archivo: `database/schema.sql:2`
- Tablas y campos:
  - `empleados`
    - `id` INT PK AUTO_INCREMENT
    - `nombre` VARCHAR(255) NOT NULL
    - `correo` VARCHAR(255) NOT NULL
    - `cargo` VARCHAR(255) NOT NULL
    - `fecha_ingreso` DATE NOT NULL
  - `familiares_directos`
    - `id` INT PK AUTO_INCREMENT
    - `id_empleado` INT NOT NULL (FK a `empleados.id`)
    - `nombre_familiar` VARCHAR(255) NOT NULL
    - `parentesco` VARCHAR(100) NOT NULL
    - `fecha_nacimiento` DATE NULL
- Relaciones:
  - `familiares_directos.id_empleado → empleados.id` con `ON DELETE CASCADE` (al eliminar un empleado, se eliminan sus familiares).

**Validaciones (Backend)**
- Empleados (`backend/src/Controllers/EmployeeController.php:77`):
  - `nombre`: requerido
  - `correo`: requerido y formato email válido
  - `cargo`: requerido
  - `fecha_ingreso`: opcional, formato `YYYY-MM-DD` si se envía
  - Errores: 422 con `{ errors: { campo: mensaje } }`
- Familiares (`backend/src/Controllers/FamilyController.php:55`):
  - `nombre_familiar`: requerido
  - `parentesco`: requerido
  - `fecha_nacimiento`: opcional, formato `YYYY-MM-DD` si se envía
  - Errores: 422 con detalle por campo

**Estructura del Proyecto**
- `backend/`: API PHP
  - `public/`: punto de entrada (`index.php`) y rutas
  - `src/Core`: Router, Controller base, Response
  - `src/Controllers`: Empleados y Familiares
  - `src/Models`: Acceso a datos (PDO)
  - `src/config.php`: Configuración DB y token
- `frontend/angular/`: SPA Angular 18
  - `src/app/services/api.service.ts`: llamadas a la API
  - `src/app/*`: componentes y vistas
- `database/schema.sql`: esquema y datos de ejemplo
- `postman/empleados_api.postman_collection.json`: colección para pruebas


