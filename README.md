# Sistema de Reserva de Espacios

Sistema full-stack para la gestión y reserva de espacios para eventos, desarrollado con **Angular** y **Laravel**.

---

## Descripción

Aplicación web que proporciona las siguientes funcionalidades:

- Ver catálogo de espacios disponibles con filtros avanzados
- Reservar espacios para eventos con validación de disponibilidad
- Gestionar reservas propias (crear, visualizar, cancelar)
- Administrar espacios (CRUD completo - requiere autenticación)
- Autenticación segura mediante JWT
- Interfaz responsiva y profesional desarrollada con PrimeNG

---

## Stack Tecnológico

### Backend
- **Laravel 11** - Framework PHP
- **PostgreSQL** - Sistema de gestión de base de datos
- **JWT Auth** - Autenticación mediante tokens
- **PHPUnit** - Framework de testing
- **Swagger/OpenAPI** - Documentación de API

### Frontend
- **Angular 20.3.10** - Framework JavaScript
- **PrimeNG** - Biblioteca de componentes UI
- **TypeScript** - Lenguaje tipado
- **RxJS** - Programación reactiva
- **Jasmine/Karma** - Framework de testing

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
│   └── storage/api-docs/    # Documentación Swagger
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

## Requisitos del Sistema

El proyecto requiere las siguientes dependencias instaladas:

- **Node.js** v24+
- **PHP** 8.2+
- **Composer** (gestor de dependencias de PHP)
- **PostgreSQL** 14+
- **Git**

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/alex95mf/reserva-espacios.git
cd reserva-espacios
```

---

### 2. Configuración del Backend (Laravel)

#### Instalación de dependencias

```bash
cd backend
composer install
```

#### Configuración del entorno

```bash
cp .env.example .env
```

Configurar el archivo `.env` con las credenciales de PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=reserva_espacios
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

JWT_SECRET=tu_clave_secreta_jwt
```

#### Generación de claves

```bash
# Clave de aplicación
php artisan key:generate

# Clave JWT
php artisan jwt:secret
```

#### Inicialización de la base de datos

```bash
php artisan migrate --seed
```

#### Generación de documentación

```bash
php artisan l5-swagger:generate
```

---

### 3. Configuración del Frontend (Angular)

#### Instalación de dependencias

```bash
cd frontend
npm install
```

#### Configuración de la URL de la API (opcional)

Para entornos donde el backend no esté en `http://localhost:8000`, modificar el archivo:

`frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://tu-backend-url/api'
};
```

---

## Ejecución

### Backend

```bash
cd backend
php artisan serve
```

Servidor disponible en: `http://localhost:8000`

---

### Frontend

En una terminal separada:

```bash
cd frontend
ng serve
```

Aplicación disponible en: `http://localhost:4200`

---

## Testing

### Backend (PHPUnit)

Ejecución de la suite de tests:

```bash
cd backend
php artisan test
```

**Cobertura de tests:**
- Autenticación: 6 tests
- Espacios: 8 tests
- Reservas: 8 tests
- **Total: 24 tests**

---

### Frontend (Jasmine/Karma)

```bash
cd frontend
ng test
```

---

## Documentación de la API

La documentación completa de la API está disponible mediante **Swagger UI** en:

```
http://localhost:8000/api/documentation
```

### Endpoints Principales

#### Autenticación
- `POST /api/registrar` - Registro de nuevos usuarios
- `POST /api/login` - Inicio de sesión (retorna JWT)
- `GET /api/yo` - Obtención de usuario autenticado
- `POST /api/logout` - Cierre de sesión

#### Espacios
- `GET /api/espacios` - Listado de espacios con filtros opcionales
- `POST /api/espacios` - Creación de espacio (requiere autenticación)
- `GET /api/espacios/{id}` - Obtención de espacio específico
- `PUT /api/espacios/{id}` - Actualización de espacio (requiere autenticación)
- `DELETE /api/espacios/{id}` - Eliminación de espacio (requiere autenticación)

#### Reservas
- `GET /api/reservas` - Listado de reservas del usuario (requiere autenticación)
- `POST /api/reservas` - Creación de reserva (requiere autenticación)
- `GET /api/reservas/{id}` - Obtención de reserva específica (requiere autenticación)
- `PUT /api/reservas/{id}` - Actualización de reserva (requiere autenticación)
- `DELETE /api/reservas/{id}` - Cancelación de reserva (requiere autenticación)

---

## Características Implementadas

### Requisitos Funcionales Principales
- Autenticación JWT completa (registro, login, logout)
- CRUD de espacios con sistema de filtros (tipo, capacidad, disponibilidad)
- Sistema de reservas con validación de superposición de horarios
- Gestión de reservas por usuario (visualización, modificación, cancelación)
- API RESTful documentada con Swagger
- Suite de testing del backend (PHPUnit)
- Documentación técnica completa

### Características Adicionales
- Testing de servicios del frontend
- Vista detallada de espacios
- Sistema de notificaciones mediante Toast
- Diseño profesional implementado con PrimeNG
- Validaciones en frontend y backend
- Manejo robusto de errores
- Diseño responsivo

---

## Arquitectura de Autenticación

El sistema implementa **JWT (JSON Web Tokens)** como mecanismo de autenticación.

### Flujo de autenticación:

1. El usuario realiza el registro o inicio de sesión
2. El backend genera un token JWT
3. El frontend almacena el token en `localStorage`
4. Las peticiones autenticadas incluyen el token en el header de autorización:

```
Authorization: Bearer {token}
```

---

## Características de la Interfaz

- Barra de navegación dinámica según estado de autenticación
- Sistema de tarjetas para visualización de espacios
- Filtros avanzados para búsqueda de espacios
- Modal de reserva con validación de fechas
- Sistema de notificaciones con animaciones
- Vista detallada de espacios individuales
- Tabla interactiva para gestión de reservas

---

## Información de Contacto

Proyecto desarrollado como prueba técnica Full Stack.

---

## Licencia

Este proyecto fue desarrollado como prueba técnica.
