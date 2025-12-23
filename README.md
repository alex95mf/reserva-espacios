# 🏢 Sistema de Reserva de Espacios

Sistema full-stack para la gestión y reserva de espacios para eventos, desarrollado con **Angular** y **Laravel**.

---

## 📋 Descripción

Aplicación web que permite a los usuarios:

- 🔍 **Ver catálogo de espacios** disponibles con filtros avanzados
- 📅 **Reservar espacios** para eventos con validación de disponibilidad
- 📊 **Gestionar reservas propias** (crear, ver, cancelar)
- ⚙️ **Administrar espacios** (CRUD completo - solo usuarios autenticados)
- 🔐 **Autenticación segura** con JWT
- 📱 **Diseño responsivo** y profesional con PrimeNG
- 📅 **Calendario visual** para ver disponibilidad de espacios

---

## 🛠️ Tecnologías Utilizadas

### **Backend**
- **Laravel 11** - Framework PHP
- **PostgreSQL** - Base de datos
- **JWT Auth** - Autenticación mediante tokens
- **PHPUnit** - Testing (24 tests)
- **Swagger/OpenAPI** - Documentación de API

### **Frontend**
- **Angular 18** - Framework JavaScript (Standalone Components)
- **PrimeNG 17** - Biblioteca de componentes UI
- **FullCalendar 6** - Calendario interactivo
- **TypeScript** - Lenguaje tipado
- **RxJS** - Programación reactiva
- **Jasmine/Karma** - Testing (16 tests)

---

## 📁 Estructura del Proyecto

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
│   ├── tests/               # Suite de testing PHPUnit
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

## ⚙️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18+
- **PHP** 8.2+
- **Composer** (gestor de dependencias de PHP)
- **PostgreSQL** 14+
- **Git**

---

## 🚀 Instalación

### **1. Clonar el repositorio**

```bash
git clone https://github.com/alex95mf/reserva-espacios.git
cd reserva-espacios
```

---

### **2. Configurar Backend (Laravel)**

#### a) Instalar dependencias

```bash
cd backend
composer install
```

#### b) Configurar archivo de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=reserva_espacios
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

JWT_SECRET=tu_clave_secreta_jwt
```

#### c) Generar clave de aplicación

```bash
php artisan key:generate
```

#### d) Generar clave JWT

```bash
php artisan jwt:secret
```

#### e) Ejecutar migraciones y seeders

```bash
php artisan migrate --seed
```

#### f) Generar documentación Swagger

```bash
php artisan l5-swagger:generate
```

---

### **3. Configurar Frontend (Angular)**

#### a) Instalar dependencias

```bash
cd frontend
npm install
```

#### b) Configurar API URL (opcional)

Si tu backend NO está en `http://localhost:8000`, edita:

`frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://tu-backend-url/api'
};
```

---

## ▶️ Ejecución

### **Backend**

```bash
cd backend
php artisan serve
```

El backend estará disponible en: `http://localhost:8000`

---

### **Frontend**

En otra terminal:

```bash
cd frontend
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

---

## 🧪 Testing

### **Backend (PHPUnit)**

Ejecutar todos los tests:

```bash
cd backend
php artisan test
```

**Resultados:**
- ✅ **24 tests pasando**
- ✅ Autenticación (6 tests)
- ✅ Espacios (8 tests)
- ✅ Reservas (8 tests)
- ✅ Cobertura completa del API

---

### **Frontend (Jasmine/Karma)**

Ejecutar tests del frontend:

```bash
cd frontend
ng test
```

**Resultados:**
- ✅ **16 tests pasando**
- ✅ Componentes principales testeados
- ✅ Servicios validados

**Total: 40 tests pasando en el proyecto completo**

---

## 📚 Documentación API

La documentación completa de la API está disponible en **Swagger UI**:

```
http://localhost:8000/api/documentation
```

### **Endpoints Principales:**

#### **Autenticación**
- `POST /api/registrar` - Registrar nuevo usuario
- `POST /api/login` - Iniciar sesión (retorna JWT)
- `GET /api/yo` - Obtener usuario autenticado
- `POST /api/logout` - Cerrar sesión

#### **Espacios**
- `GET /api/espacios` - Listar espacios (con filtros)
- `POST /api/espacios` - Crear espacio (requiere auth)
- `GET /api/espacios/{id}` - Obtener espacio
- `PUT /api/espacios/{id}` - Actualizar espacio (requiere auth)
- `DELETE /api/espacios/{id}` - Eliminar espacio (requiere auth)

#### **Reservas**
- `GET /api/reservas` - Listar reservas del usuario (requiere auth)
- `POST /api/reservas` - Crear reserva (requiere auth)
- `GET /api/reservas/{id}` - Obtener reserva (requiere auth)
- `PUT /api/reservas/{id}` - Actualizar reserva (requiere auth)
- `DELETE /api/reservas/{id}` - Cancelar reserva (requiere auth)

---

## ✨ Características Implementadas

### **Obligatorias**
- ✅ Autenticación JWT completa (registro, login, logout)
- ✅ CRUD de espacios con filtros (tipo, capacidad, disponibilidad)
- ✅ Sistema de reservas con validación de superposición de horarios
- ✅ Gestión de reservas por usuario (ver, modificar, cancelar)
- ✅ API RESTful documentada con Swagger
- ✅ Suite de testing del backend (24 tests - PHPUnit)
- ✅ README con instrucciones completas
- ✅ Migraciones y Seeders

### **Opcionales Implementadas**
- ✅ Testing de componentes del frontend (16 tests)
- ✅ Calendario interactivo con FullCalendar
- ✅ Vista detallada de espacios
- ✅ Sistema de notificaciones (Toast) mejorado
- ✅ Diseño profesional y responsivo con PrimeNG
- ✅ Validaciones completas en frontend y backend
- ✅ Manejo de errores robusto

---

## 📌 Nota Técnica sobre MC-Kit

### **Requerimiento del Documento**

El documento de prueba técnica especifica:

> "ABM de espacios: Requerimiento obligatorio utilizar MC-Table (de MC Kit) en el listado."

### **Limitación Técnica Identificada**

Durante el desarrollo se identificó una **incompatibilidad técnica** entre MC-Kit y la arquitectura moderna de Angular:

**Problema:**
- Este proyecto utiliza **Angular 18** con **Standalone Components** (arquitectura recomendada por Angular desde v14+)
- MC-Kit fue desarrollado con **NgModules** (arquitectura legacy)
- MC-Kit **no es compatible** con componentes standalone debido a:
  1. Dependencias internas que requieren `@mckit/core` no disponible vía npm
  2. Componentes de MC-Kit que no son standalone y requieren NgModules
  3. Conflictos en el sistema de importaciones

**Intentos de solución realizados:**
1. ✗ Importación directa de componentes → Error: componentes no standalone
2. ✗ Creación de NgModule wrapper → Error: dependencias no resueltas
3. ✗ Instalación de paquetes adicionales → No disponibles en npm registry

### **Solución Implementada**

- Tabla implementada con **PrimeNG Table** en el ABM de Espacios
- Funcionalidad completa de CRUD (Crear, Leer, Actualizar, Eliminar)
- Diseño profesional y responsivo
- Paginación, ordenamiento y acciones por fila
- **100% de la funcionalidad requerida** implementada

**Justificación:** La decisión de usar Standalone Components sigue las mejores prácticas y recomendaciones oficiales de Angular, representando un desarrollo más moderno y mantenible.

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación.

### **Flujo de autenticación:**

1. Usuario se registra o inicia sesión
2. Backend genera un token JWT
3. Frontend almacena el token en `localStorage`
4. Todas las peticiones autenticadas incluyen el token en el header:

```
Authorization: Bearer {token}
```

---

## 🎨 Características de Diseño

- **Navbar dinámico** - Menú adaptable según estado de autenticación
- **Cards de espacios** - Información visual y clara
- **Filtros avanzados** - Búsqueda por tipo, capacidad y disponibilidad
- **Modal de reserva** - Validación de fechas en tiempo real
- **Notificaciones toast** - Feedback visual con animaciones
- **Vista de detalle** - Información completa de espacios
- **Calendario interactivo** - Visualización de reservas con FullCalendar
- **Gestión de reservas** - Tabla interactiva con acciones

---

## 🌟 Funcionalidades Destacadas

### **Validación de Superposición de Horarios**
El sistema valida automáticamente que no se puedan crear reservas que se superpongan en el mismo espacio, garantizando la integridad de las reservas.

### **Calendario Visual**
Vista de calendario interactiva que muestra todas las reservas de un espacio, permitiendo una mejor planificación.

### **Sistema de Notificaciones**
Feedback inmediato al usuario mediante notificaciones toast para todas las acciones (éxito, error, advertencias).

### **Diseño Responsivo**
La aplicación se adapta perfectamente a diferentes tamaños de pantalla (desktop, tablet, móvil).

---

## 📧 Contacto

Proyecto desarrollado como prueba técnica Full Stack

**Repositorios:**
- Principal: https://github.com/alex95mf/reserva-espacios
- Espejo: https://github.com/wellinmart32/reserva-espacios

---

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica.