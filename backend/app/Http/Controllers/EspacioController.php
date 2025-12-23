<?php

namespace App\Http\Controllers;

use App\Models\Espacio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EspacioController extends Controller
{
    /**
     * @OA\Get(
     *     path="/espacios",
     *     summary="Listar todos los espacios",
     *     tags={"Espacios"},
     *     @OA\Parameter(
     *         name="tipo",
     *         in="query",
     *         description="Filtrar por tipo de espacio",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="disponible",
     *         in="query",
     *         description="Filtrar por disponibilidad (0 o 1)",
     *         required=false,
     *         @OA\Schema(type="boolean")
     *     ),
     *     @OA\Parameter(
     *         name="capacidad_minima",
     *         in="query",
     *         description="Filtrar por capacidad mínima",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de espacios",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="nombre", type="string", example="Sala de Conferencias A"),
     *             @OA\Property(property="descripcion", type="string"),
     *             @OA\Property(property="capacidad", type="integer", example=50),
     *             @OA\Property(property="tipo", type="string", example="Sala de Conferencias"),
     *             @OA\Property(property="imagen_url", type="string"),
     *             @OA\Property(property="disponible", type="boolean")
     *         ))
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Espacio::query();

        if ($request->has('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->has('disponible')) {
            $query->where('disponible', $request->disponible);
        }

        if ($request->has('capacidad_minima')) {
            $query->where('capacidad', '>=', $request->capacidad_minima);
        }

        $espacios = $query->get();

        return response()->json($espacios);
    }

    /**
     * @OA\Post(
     *     path="/espacios",
     *     summary="Crear nuevo espacio",
     *     tags={"Espacios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nombre","capacidad","tipo"},
     *             @OA\Property(property="nombre", type="string", example="Sala de Conferencias A"),
     *             @OA\Property(property="descripcion", type="string", example="Sala amplia con proyector"),
     *             @OA\Property(property="capacidad", type="integer", example=50),
     *             @OA\Property(property="tipo", type="string", example="Sala de Conferencias"),
     *             @OA\Property(property="imagen_url", type="string", example="https://example.com/imagen.jpg"),
     *             @OA\Property(property="disponible", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Espacio creado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="mensaje", type="string"),
     *             @OA\Property(property="espacio", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=422, description="Errores de validación")
     * )
     */
    public function store(Request $request)
    {
        $validador = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'capacidad' => 'required|integer|min:1',
            'tipo' => 'required|string',
            'imagen_url' => 'nullable|url',
            'disponible' => 'boolean'
        ]);

        if ($validador->fails()) {
            return response()->json(['errores' => $validador->errors()], 422);
        }

        $espacio = Espacio::create($request->all());

        return response()->json([
            'mensaje' => 'Espacio creado exitosamente',
            'espacio' => $espacio
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/espacios/{id}",
     *     summary="Obtener un espacio específico",
     *     tags={"Espacios"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del espacio",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles del espacio",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="nombre", type="string"),
     *             @OA\Property(property="descripcion", type="string"),
     *             @OA\Property(property="capacidad", type="integer"),
     *             @OA\Property(property="tipo", type="string"),
     *             @OA\Property(property="imagen_url", type="string"),
     *             @OA\Property(property="disponible", type="boolean")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Espacio no encontrado")
     * )
     */
    public function show($id)
    {
        $espacio = Espacio::find($id);

        if (!$espacio) {
            return response()->json(['error' => 'Espacio no encontrado'], 404);
        }

        return response()->json($espacio);
    }

    /**
     * @OA\Put(
     *     path="/espacios/{id}",
     *     summary="Actualizar un espacio",
     *     tags={"Espacios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del espacio",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="nombre", type="string"),
     *             @OA\Property(property="descripcion", type="string"),
     *             @OA\Property(property="capacidad", type="integer"),
     *             @OA\Property(property="tipo", type="string"),
     *             @OA\Property(property="imagen_url", type="string"),
     *             @OA\Property(property="disponible", type="boolean")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Espacio actualizado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="mensaje", type="string"),
     *             @OA\Property(property="espacio", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=404, description="Espacio no encontrado"),
     *     @OA\Response(response=422, description="Errores de validación")
     * )
     */
    public function update(Request $request, $id)
    {
        $espacio = Espacio::find($id);

        if (!$espacio) {
            return response()->json(['error' => 'Espacio no encontrado'], 404);
        }

        $validador = Validator::make($request->all(), [
            'nombre' => 'string|max:255',
            'descripcion' => 'nullable|string',
            'capacidad' => 'integer|min:1',
            'tipo' => 'string',
            'imagen_url' => 'nullable|url',
            'disponible' => 'boolean'
        ]);

        if ($validador->fails()) {
            return response()->json(['errores' => $validador->errors()], 422);
        }

        $espacio->update($request->all());

        return response()->json([
            'mensaje' => 'Espacio actualizado exitosamente',
            'espacio' => $espacio
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/espacios/{id}",
     *     summary="Eliminar un espacio",
     *     tags={"Espacios"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del espacio",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Espacio eliminado exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="mensaje", type="string", example="Espacio eliminado exitosamente")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=404, description="Espacio no encontrado")
     * )
     */
    public function destroy($id)
    {
        $espacio = Espacio::find($id);

        if (!$espacio) {
            return response()->json(['error' => 'Espacio no encontrado'], 404);
        }

        $espacio->delete();

        return response()->json(['mensaje' => 'Espacio eliminado exitosamente']);
    }
}