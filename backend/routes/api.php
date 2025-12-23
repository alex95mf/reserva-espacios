<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EspacioController;
use App\Http\Controllers\ReservaController;

// Rutas públicas
Route::post('registrar', [AuthController::class, 'registrar']);
Route::post('login', [AuthController::class, 'login']);

// Rutas de espacios (públicas - solo lectura)
Route::get('espacios', [EspacioController::class, 'index']);
Route::get('espacios/{id}', [EspacioController::class, 'show']);
Route::get('espacios/{id}/reservas', [ReservaController::class, 'reservasPorEspacio']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:api')->group(function () {
    
    // Rutas de autenticación
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refrescar', [AuthController::class, 'refrescar']);
    Route::get('yo', [AuthController::class, 'yo']);
    
    // Rutas de espacios (administración - requieren autenticación)
    Route::post('espacios', [EspacioController::class, 'store']);
    Route::put('espacios/{id}', [EspacioController::class, 'update']);
    Route::delete('espacios/{id}', [EspacioController::class, 'destroy']);
    
    // Rutas de reservas (requieren autenticación)
    Route::get('reservas', [ReservaController::class, 'index']);
    Route::post('reservas', [ReservaController::class, 'store']);
    Route::get('reservas/{id}', [ReservaController::class, 'show']);
    Route::put('reservas/{id}', [ReservaController::class, 'update']);
    Route::delete('reservas/{id}', [ReservaController::class, 'destroy']);
});