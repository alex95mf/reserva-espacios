<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Registrar nuevo usuario
     */
    public function registrar(Request $request)
    {
        $validador = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validador->fails()) {
            return response()->json(['errores' => $validador->errors()], 422);
        }

        $usuario = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'mensaje' => 'Usuario registrado exitosamente',
            'usuario' => $usuario
        ], 201);
    }

    /**
     * Iniciar sesión
     */
    public function login(Request $request)
    {
        $credenciales = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credenciales)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        return $this->respuestaConToken($token);
    }

    /**
     * Obtener usuario autenticado
     */
    public function yo()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Cerrar sesión
     */
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['mensaje' => 'Sesión cerrada exitosamente']);
    }

    /**
     * Refrescar token
     */
    public function refrescar()
    {
        return $this->respuestaConToken(auth('api')->refresh());
    }

    /**
     * Estructura de respuesta con token
     */
    protected function respuestaConToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'usuario' => auth('api')->user()
        ]);
    }
}