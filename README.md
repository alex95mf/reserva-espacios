# 🏢 Sistema de Reserva de Espacios

Sistema completo de gestión y reserva de espacios para eventos desarrollado con Angular y Laravel.

## 📋 Descripción

Aplicación web full-stack que permite:
- Ver catálogo de espacios disponibles con filtros
- Reservar espacios para eventos
- Gestionar reservas propias
- Administrar espacios (solo administradores)

## 🛠️ Tecnologías

### Frontend
- Angular 20.3.10
- PrimeNG
- TypeScript
- RxJS

### Backend
- Laravel 11
- PostgreSQL
- JWT Authentication
- Swagger Documentation

## 📁 Estructura del Proyecto
```
reserva-espacios/
├── backend/          # API Laravel
├── frontend/         # SPA Angular
└── README.md         # Este archivo
```

## 🚀 Instalación

### Requisitos Previos
- Node.js v24+
- PHP 8.2+
- Composer
- PostgreSQL

### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend (Angular)
```bash
cd frontend
npm install
ng serve
```

## 📝 Estado del Desarrollo

- [x] Inicialización del proyecto
- [ ] Configuración del backend
- [ ] Configuración del frontend
- [ ] Implementación de características

## 👨‍💻 Autor

Desarrollado como prueba técnica Full Stack

## 📄 Licencia

Este proyecto es de código abierto para fines educativos