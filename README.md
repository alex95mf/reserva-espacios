# Sistema de Reserva de Espacios

Sistema full-stack desarrollado con Angular y Laravel para la gestión integral de espacios y reservas de eventos.

---

## Descripción del Proyecto

Esta aplicación web permite a los usuarios navegar por un catálogo de espacios disponibles, realizar reservas para eventos con validación automática de disponibilidad, y gestionar sus propias reservas. Los usuarios autenticados con permisos de administrador pueden realizar operaciones CRUD completas sobre los espacios.

El sistema implementa autenticación segura mediante JWT, diseño responsivo adaptable a diferentes dispositivos, y un calendario visual para facilitar la planificación de eventos.

---

## Stack Tecnológico

**Backend**
- Laravel 11 como framework principal
- PostgreSQL para persistencia de datos
- Autenticación JWT para manejo de sesiones
- Suite de testing con PHPUnit (24 tests implementados)
- Documentación automática con Swagger/OpenAPI

**Frontend**
- Angular 18 con arquitectura de Standalone Components
- PrimeNG 17 para componentes de interfaz
- FullCalendar 6 para visualización de calendario
- TypeScript para tipado estático
- RxJS para programación reactiva
- Testing con Jasmine/Karma (16 tests implementados)

---

## Estructura del Repositorio

```
reserva-espacios/
├── backend/
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
├── frontend/
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

Antes de comenzar, asegúrate de contar con:

- Node.js versión 18 o superior
- PHP 8.2 o superior
- Composer (gestor de dependencias de PHP)
- PostgreSQL 14 o superior
- Git

---

## Guía de Instalación

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/alex95mf/reserva-espacios.git
cd reserva-espacios
```

### Paso 2: Configuración del Backend

**Instalar dependencias de PHP**

```bash
cd backend
composer install
```

**Configurar variables de entorno**

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de base de datos:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=reserva_espacios
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

JWT_SECRET=tu_clave_secreta_jwt
```

**Generar claves de aplicación**

```bash
php artisan key:generate
php artisan jwt:secret
```

**Ejecutar migraciones y datos de prueba**

```bash
php artisan migrate --seed
```

**Generar documentación de API**

```bash
php artisan l5-swagger:generate
```

### Paso 3: Configuración del Frontend

**Instalar dependencias de Node**

```bash
cd frontend
npm install
```

**Configurar URL de API (opcional)**

Si tu backend no está en `http://localhost:8000`, edita el archivo `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://tu-backend-url/api'
};
```

---

## Ejecución del Proyecto

### Iniciar el Backend

```bash
cd backend
php artisan serve
```

El servidor backend estará disponible en `http://localhost:8000`

### Iniciar el Frontend

En una terminal separada:

```bash
cd frontend
ng serve
```

La aplicación frontend estará disponible en `http://localhost:4200`

---

## Suite de Testing

### Tests del Backend

El backend cuenta con 24 tests que cubren:
- Autenticación de usuarios (6 tests)
- Gestión de espacios (8 tests)
- Sistema de reservas (8 tests)
- Casos de uso básicos (2 tests)

Para ejecutar los tests:

```bash
cd backend
php artisan test
```

### Tests del Frontend

El frontend implementa 16 tests que validan los componentes principales y servicios de la aplicación.

Para ejecutar los tests:

```bash
cd frontend
ng test
```

**Cobertura total del proyecto: 40 tests**

---

## Documentación de la API

La documentación completa de la API está disponible a través de Swagger UI en:

```
http://localhost:8000/api/documentation
```

### Endpoints Principales

**Autenticación**
- POST `/api/registrar` - Registro de nuevos usuarios
- POST `/api/login` - Autenticación (retorna token JWT)
- GET `/api/yo` - Información del usuario autenticado
- POST `/api/logout` - Cierre de sesión

**Gestión de Espacios**
- GET `/api/espacios` - Lista de espacios con filtros opcionales
- POST `/api/espacios` - Crear nuevo espacio (requiere autenticación)
- GET `/api/espacios/{id}` - Detalle de un espacio
- PUT `/api/espacios/{id}` - Actualizar espacio (requiere autenticación)
- DELETE `/api/espacios/{id}` - Eliminar espacio (requiere autenticación)

**Sistema de Reservas**
- GET `/api/reservas` - Lista de reservas del usuario (requiere autenticación)
- POST `/api/reservas` - Crear nueva reserva (requiere autenticación)
- GET `/api/reservas/{id}` - Detalle de reserva (requiere autenticación)
- PUT `/api/reservas/{id}` - Modificar reserva (requiere autenticación)
- DELETE `/api/reservas/{id}` - Cancelar reserva (requiere autenticación)

---

## Funcionalidades Implementadas

### Requerimientos Obligatorios

- Sistema completo de autenticación JWT con registro, login y logout
- CRUD de espacios con filtros por tipo, capacidad y disponibilidad
- Sistema de reservas con validación automática de superposición de horarios
- Gestión de reservas por usuario con capacidad de ver, modificar y cancelar
- API RESTful completamente documentada con Swagger
- Suite completa de testing del backend (24 tests con PHPUnit)
- Documentación detallada con instrucciones de instalación y uso
- Migraciones de base de datos y seeders para datos de prueba

### Implementaciones Adicionales

- Testing de componentes del frontend (16 tests con Jasmine/Karma)
- Calendario interactivo con FullCalendar para visualización de reservas
- Vista detallada de espacios con información completa
- Sistema de notificaciones tipo toast para feedback del usuario
- Diseño profesional y completamente responsivo con PrimeNG
- Validaciones exhaustivas tanto en frontend como backend
- Manejo robusto de errores con mensajes descriptivos

---

## Nota Técnica sobre MC-Kit

### Contexto del Requerimiento

El documento de especificaciones técnicas establece como obligatorio:

> "ABM de espacios: Requerimiento obligatorio utilizar MC-Table (de MC Kit) en el listado."

### Análisis de Compatibilidad Técnica

Durante el desarrollo se identificó una incompatibilidad técnica entre la librería MC-Kit y la arquitectura del proyecto:

**Arquitectura del Proyecto**

Este proyecto utiliza Angular 18 con Standalone Components, que es la arquitectura recomendada por el equipo de Angular desde la versión 14. Esta aproximación moderna elimina la necesidad de NgModules, simplifica la estructura del código y mejora el tree-shaking.

**Limitaciones de MC-Kit**

MC-Kit fue desarrollado utilizando NgModules, la arquitectura legacy de Angular. Al intentar integrar la librería, se identificaron los siguientes problemas técnicos:

1. Dependencias internas que requieren `@mckit/core`, paquete no disponible en el registro npm público
2. Componentes de MC-Kit que no son standalone y requieren declaración en NgModules
3. Errores de compilación en el proceso de build de la librería (archivo `mc-component` no encontrado)
4. Conflictos en el sistema de importaciones entre arquitecturas standalone y basadas en módulos

**Intentos de Solución Documentados**

1. Instalación directa desde repositorio GitHub: Exitosa
2. Importación directa de componentes standalone: Falló debido a que los componentes no son standalone
3. Creación de NgModule wrapper: Falló por dependencias no resueltas
4. Compilación manual de MC-Kit desde el código fuente: Falló con error "Could not resolve './lib/entities/mc-component'"

**Solución Implementada**

Dada la imposibilidad técnica de utilizar MC-Kit, se implementó la funcionalidad equivalente utilizando PrimeNG Table en el módulo de administración de espacios. Esta implementación incluye:

- Funcionalidad completa de CRUD (Crear, Leer, Actualizar, Eliminar)
- Diseño profesional y consistente con el resto de la aplicación
- Paginación, ordenamiento y acciones por fila
- Rendimiento óptimo y totalmente funcional

**Justificación Técnica**

La decisión de utilizar Standalone Components sigue las mejores prácticas y recomendaciones oficiales del equipo de Angular. Esta arquitectura representa el futuro del framework y ofrece beneficios significativos en términos de mantenibilidad, rendimiento y developer experience.

La incompatibilidad con MC-Kit no representa una limitación del proyecto, sino una restricción de la librería externa que no ha sido actualizada para soportar las características modernas de Angular.

---

## Sistema de Autenticación

El sistema implementa autenticación basada en tokens JWT (JSON Web Tokens).

**Flujo de Autenticación**

1. El usuario se registra o inicia sesión proporcionando credenciales válidas
2. El backend valida las credenciales y genera un token JWT firmado
3. El frontend almacena el token en localStorage del navegador
4. Todas las peticiones autenticadas incluyen el token en el encabezado HTTP:
   ```
   Authorization: Bearer {token}
   ```
5. El backend valida el token en cada petición protegida
6. Al cerrar sesión, el token se elimina del almacenamiento local

---

## Características Destacadas del Diseño

**Interfaz Adaptativa**

El navbar se adapta dinámicamente al estado de autenticación del usuario, mostrando opciones relevantes según sus permisos. El diseño es completamente responsivo y se ajusta a diferentes tamaños de pantalla.

**Visualización de Datos**

Los espacios se presentan en formato de cards con información visual clara. El sistema incluye filtros avanzados para búsqueda por tipo, capacidad y disponibilidad.

**Sistema de Reservas**

El modal de reservas incluye validación de fechas en tiempo real y prevención de superposición de horarios. Las notificaciones toast proporcionan feedback inmediato sobre el estado de las operaciones.

**Calendario Interactivo**

La vista de calendario permite visualizar todas las reservas de un espacio de forma gráfica, facilitando la planificación y evitando conflictos de horarios.

---

## Información del Proyecto

**Repositorios**
- Principal: https://github.com/alex95mf/reserva-espacios
- Mirror: https://github.com/wellinmart32/reserva-espacios

**Desarrollo**

Proyecto desarrollado como prueba técnica full-stack, demostrando competencias en desarrollo de APIs RESTful, aplicaciones web modernas, testing automatizado y documentación técnica.

---

## Licencia

Este proyecto fue desarrollado como ejercicio técnico de evaluación.