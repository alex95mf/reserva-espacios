# Sistema de Reserva de Espacios

Aplicación full-stack para gestión de espacios y reservas de eventos, construida con Angular y Laravel.

---

## Descripción

Este proyecto es un sistema de gestión de espacios donde los usuarios pueden explorar espacios disponibles, hacer reservas para sus eventos y administrar sus propias reservas. Los administradores tienen acceso completo para gestionar el catálogo de espacios.

He implementado autenticación JWT para mantener las sesiones seguras, un calendario interactivo para visualizar disponibilidad, y validaciones que previenen reservas en conflicto. El diseño es responsivo y funciona bien en cualquier dispositivo.

---

## Stack Tecnológico

**Backend**
- Laravel 11 - Framework principal
- PostgreSQL - Base de datos
- JWT Auth - Manejo de autenticación
- PHPUnit - 24 tests implementados
- Swagger - Documentación automática de la API

**Frontend**
- Angular 18 con Standalone Components
- PrimeNG 17 - Componentes UI
- FullCalendar 6 - Sistema de calendario
- TypeScript - Tipado estático
- RxJS - Manejo de streams y estado reactivo
- Jasmine/Karma - 16 tests implementados

---

## Estructura del Proyecto

```
reserva-espacios/
├── backend/                 # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── ...
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   ├── tests/
│   └── storage/api-docs/
├── frontend/                # SPA Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── guards/
│   │   └── ...
│   └── ...
└── README.md
```

---

## Requisitos

Se necesita tener instalado:

- Node.js 18+
- PHP 8.2+
- Composer
- PostgreSQL 14+
- Git

---

## Instalación

### 1. Clonar el proyecto

```bash
git clone https://github.com/alex95mf/reserva-espacios.git
cd reserva-espacios
```

### 2. Configurar el Backend

**Instalar dependencias**

```bash
cd backend
composer install
```

**Configurar el entorno**

Copiar el archivo de ejemplo y ajustar las credenciales de la base de datos:

```bash
cp .env.example .env
```

Edita `.env` con los datos:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=reserva_espacios
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

JWT_SECRET=tu_clave_secreta_jwt
```

**Generar claves**

```bash
php artisan key:generate
php artisan jwt:secret
```

**Preparar la base de datos**

Esto creará las tablas y poblará la base con datos de prueba:

```bash
php artisan migrate --seed
```

**Generar documentación de la API**

```bash
php artisan l5-swagger:generate
```

### 3. Configurar el Frontend

**Instalar dependencias**

```bash
cd frontend
npm install
```

**Configurar la URL del backend (opcional)**

Si el backend no corre en `http://localhost:8000`, actualizar `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://tu-backend-url/api'
};
```

---

## Ejecutar el Proyecto

**Backend**

```bash
cd backend
php artisan serve
```

Se ejecuta en: `http://localhost:8000`

**Frontend**

En otra terminal:

```bash
cd frontend
ng serve
```

Corre en: `http://localhost:4200`

---

## Tests

He implementado tests tanto para el backend como para el frontend. En total son 40 tests que cubren los flujos principales de la aplicación.

**Backend (PHPUnit)**

```bash
cd backend
php artisan test
```

Cobertura:
- 6 tests de autenticación
- 8 tests de espacios
- 8 tests de reservas
- 2 tests de casos de uso base

**Frontend (Jasmine/Karma)**

```bash
cd frontend
ng test
```

16 tests que validan componentes principales y servicios.

---

## Documentación de la API

Se puede explora toda la API en Swagger:

```
http://localhost:8000/api/documentation
```

### Endpoints principales

**Autenticación**
- `POST /api/registrar` - Crear cuenta nueva
- `POST /api/login` - Iniciar sesión (devuelve token JWT)
- `GET /api/yo` - Info del usuario actual
- `POST /api/logout` - Cerrar sesión

**Espacios**
- `GET /api/espacios` - Listar espacios (soporta filtros)
- `POST /api/espacios` - Crear espacio (requiere auth)
- `GET /api/espacios/{id}` - Ver detalle
- `PUT /api/espacios/{id}` - Actualizar (requiere auth)
- `DELETE /api/espacios/{id}` - Eliminar (requiere auth)

**Reservas**
- `GET /api/reservas` - Mis reservas (requiere auth)
- `POST /api/reservas` - Crear reserva (requiere auth)
- `GET /api/reservas/{id}` - Ver detalle (requiere auth)
- `PUT /api/reservas/{id}` - Modificar (requiere auth)
- `DELETE /api/reservas/{id}` - Cancelar (requiere auth)

---

## Características Implementadas

### Lo esencial (requerimientos obligatorios)

- Sistema completo de autenticación con JWT
- CRUD de espacios con filtros por tipo, capacidad y disponibilidad
- Sistema de reservas que valida automáticamente conflictos de horarios
- Los usuarios pueden ver, modificar y cancelar sus propias reservas
- API RESTful documentada con Swagger
- 24 tests del backend con PHPUnit
- Este README con instrucciones completas
- Migraciones y seeders para la base de datos

### Extras que agregué

- 16 tests del frontend con Jasmine/Karma
- Calendario interactivo con FullCalendar
- Vista detallada de cada espacio
- Notificaciones toast para feedback del usuario
- Diseño responsivo con PrimeNG
- Validaciones en ambos lados (frontend y backend)
- Manejo de errores con mensajes descriptivos

---

## Sobre MC-Kit

### El requerimiento original

Las especificaciones pedían usar MC-Table (de MC Kit) para el listado de espacios:

> "ABM de espacios: Requerimiento obligatorio utilizar MC-Table (de MC Kit) en el listado."

### El problema que encontré

MC-Kit no es compatible con la arquitectura moderna de Angular que usé en este proyecto. Específicamente:

**Mi implementación**
- Angular 18 con Standalone Components (la forma recomendada desde Angular 14+)
- Arquitectura más limpia y mantenible
- Mejor tree-shaking y performance

**MC-Kit**
- Construido con NgModules (arquitectura legacy)
- Requiere `@mckit/core` que no está en npm
- Los componentes no son standalone
- Genera errores de compilación al intentar integrarlo

### Lo que intenté

1. Instalación directa desde GitHub - funcionó
2. Importar componentes como standalone - falló (no son standalone)
3. Crear un wrapper con NgModule - falló (dependencias faltantes)
4. Compilar MC-Kit desde el código fuente - falló (archivos internos no encontrados)

### La solución

Implementé la tabla de administración usando PrimeNG Table, que ofrece:
- Funcionalidad completa de CRUD
- Diseño profesional y consistente
- Paginación, ordenamiento y filtros
- Todo funcionando sin problemas

**¿Por qué elegí Standalone Components?**

Es la dirección oficial que tomó Angular. Es más moderno, más simple de mantener y representa el futuro del framework. La incompatibilidad con MC-Kit es una limitación de esa librería, no del proyecto.

---

## Autenticación

El sistema usa JWT (JSON Web Tokens) para manejar las sesiones:

1. El usuario se registra o inicia sesión
2. El backend genera un token JWT firmado
3. El frontend guarda el token en localStorage
4. Cada petición autenticada incluye el token:
   ```
   Authorization: Bearer {token}
   ```
5. El backend valida el token en endpoints protegidos
6. Al cerrar sesión, el token se elimina

Simple y seguro.

---

## Características del Diseño

**Navegación adaptativa**
El navbar cambia según el estado del usuario. Si estás logueado, ves opciones adicionales según tus permisos.

**Catálogo de espacios**
Los espacios se muestran en cards con toda la info importante. Hay filtros para buscar por tipo, capacidad o disponibilidad.

**Sistema de reservas**
El modal de reservas valida fechas en tiempo real y previene que reserves un espacio ya ocupado. Las notificaciones te confirman cuando todo sale bien (o te avisan si algo falla).

**Calendario**
Puedes ver todas las reservas de un espacio en formato calendario, lo que hace más fácil planificar tus eventos.

**Responsivo**
Todo funciona bien en desktop, tablet y móvil.

---

## Repositorios

- Principal: https://github.com/alex95mf/reserva-espacios
- Mirror: https://github.com/wellinmart32/reserva-espacios

---

## Notas Finales

Este proyecto fue desarrollado como prueba técnica para demostrar competencias en desarrollo full-stack. Incluye desde arquitectura de APIs hasta testing automatizado, pasando por UX/UI y documentación técnica.

Si tienes preguntas o sugerencias, no dudes en abrir un issue en el repositorio.
