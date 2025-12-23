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

---

## 🛠️ Tecnologías Utilizadas

### **Backend**
- **Laravel 11** - Framework PHP
- **PostgreSQL** - Base de datos
- **JWT Auth** - Autenticación mediante tokens
- **PHPUnit** - Testing
- **Swagger/OpenAPI** - Documentación de API

### **Frontend**
- **Angular 20.3.10** - Framework JavaScript
- **PrimeNG** - Biblioteca de componentes UI
- **TypeScript** - Lenguaje tipado
- **RxJS** - Programación reactiva
- **Jasmine/Karma** - Testing

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

## ⚙️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v24+
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

**Cobertura de tests:**
- ✅ Autenticación (6 tests)
- ✅ Espacios (8 tests)
- ✅ Reservas (8 tests)
- ✅ **Total: 24 tests pasando**

---

### **Frontend (Jasmine/Karma)**
```bash
cd frontend
ng test
```

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
- ✅ Suite de testing del backend (PHPUnit)
- ✅ README con instrucciones completas

### **Opcionales Implementadas**
- ✅ Testing de servicios del frontend
- ✅ Vista detallada de espacios
- ✅ Sistema de notificaciones (Toast) mejorado
- ✅ Diseño profesional con PrimeNG
- ✅ Validaciones en frontend y backend
- ✅ Manejo de errores robusto
- ✅ Diseño responsivo

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

- **Navbar dinámico** que cambia según el estado de autenticación
- **Cards de espacios** con información visual
- **Filtros avanzados** para búsqueda de espacios
- **Modal de reserva** con validación de fechas
- **Notificaciones toast** con animaciones
- **Vista de detalle** de espacios
- **Gestión de reservas** con tabla interactiva

---

## 📧 Contacto

Desarrollado como prueba técnica Full Stack

---

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica.