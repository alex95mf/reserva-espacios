<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="API de Reserva de Espacios",
 *     version="1.0.0",
 *     description="API REST para gestión de espacios y reservas",
 *     @OA\Contact(
 *         email="soporte@reservaespacios.com"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Servidor de desarrollo"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
abstract class Controller
{
}