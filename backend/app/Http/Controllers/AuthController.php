<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/registrar",
     *     summary="Registrar nuevo usuario",
     *     tags={"Autenticación"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password"},
     *             @OA\Property(property="name", type="string", example="Juan Pérez"),
     *             @OA\Property(property="email", type="string", format="email", example="juan@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuario registrado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="mensaje", type="string", example="Usuario registrado exitosamente"),
     *             @OA\Property(property="usuario", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Juan Pérez"),
     *                 @OA\Property(property="email", type="string", example="juan@example.com")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=422, description="Errores de validación")
     * )
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
     * @OA\Post(
     *     path="/login",
     *     summary="Iniciar sesión",
     *     tags={"Autenticación"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="juan@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login exitoso",
     *         @OA\JsonContent(
     *             @OA\Property(property="access_token", type="string"),
     *             @OA\Property(property="token_type", type="string", example="bearer"),
     *             @OA\Property(property="expires_in", type="integer", example=3600),
     *             @OA\Property(property="usuario", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Credenciales inválidas")
     * )
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
     * @OA\Get(
     *     path="/yo",
     *     summary="Obtener usuario autenticado",
     *     tags={"Autenticación"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Datos del usuario autenticado",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Juan Pérez"),
     *             @OA\Property(property="email", type="string", example="juan@example.com")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function yo()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * @OA\Post(
     *     path="/logout",
     *     summary="Cerrar sesión",
     *     tags={"Autenticación"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Sesión cerrada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="mensaje", type="string", example="Sesión cerrada exitosamente")
     *         )
     *     )
     * )
     */
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['mensaje' => 'Sesión cerrada exitosamente']);
    }

    /**
     * @OA\Post(
     *     path="/refrescar",
     *     summary="Refrescar token JWT",
     *     tags={"Autenticación"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Token refrescado",
     *         @OA\JsonContent(
     *             @OA\Property(property="access_token", type="string"),
     *             @OA\Property(property="token_type", type="string", example="bearer"),
     *             @OA\Property(property="expires_in", type="integer")
     *         )
     *     )
     * )
     */
    public function refrescar()
    {
        return $this->respuestaConToken(auth('api')->refresh());
    }

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