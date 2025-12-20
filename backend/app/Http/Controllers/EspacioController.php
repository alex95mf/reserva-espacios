<?php

namespace App\Http\Controllers;

use App\Models\Espacio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EspacioController extends Controller
{
    /**
     * Listar todos los espacios
     */
    public function index(Request $request)
    {
        $query = Espacio::query();

        // Filtro por tipo
        if ($request->has('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        // Filtro por disponibilidad
        if ($request->has('disponible')) {
            $query->where('disponible', $request->disponible);
        }

        // Filtro por capacidad mínima
        if ($request->has('capacidad_minima')) {
            $query->where('capacidad', '>=', $request->capacidad_minima);
        }

        $espacios = $query->get();

        return response()->json($espacios);
    }

    /**
     * Crear nuevo espacio (solo admin)
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
     * Mostrar un espacio específico
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
     * Actualizar espacio (solo admin)
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
     * Eliminar espacio (solo admin)
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