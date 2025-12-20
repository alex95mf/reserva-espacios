<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Espacio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservaController extends Controller
{
    /**
     * Listar reservas del usuario autenticado
     */
    public function index()
    {
        $reservas = auth('api')->user()->reservas()->with('espacio')->get();
        return response()->json($reservas);
    }

    /**
     * Crear nueva reserva
     */
    public function store(Request $request)
    {
        $validador = Validator::make($request->all(), [
            'espacio_id' => 'required|exists:espacios,id',
            'nombre_evento' => 'required|string|max:255',
            'fecha_inicio' => 'required|date|after:now',
            'fecha_fin' => 'required|date|after:fecha_inicio',
        ]);

        if ($validador->fails()) {
            return response()->json(['errores' => $validador->errors()], 422);
        }

        // Validar que el espacio esté disponible
        $espacio = Espacio::find($request->espacio_id);
        if (!$espacio->disponible) {
            return response()->json(['error' => 'El espacio no está disponible'], 400);
        }

        // Validar superposición de horarios
        $superposicion = Reserva::where('espacio_id', $request->espacio_id)
            ->where('estado', '!=', 'cancelada')
            ->where(function ($query) use ($request) {
                $query->whereBetween('fecha_inicio', [$request->fecha_inicio, $request->fecha_fin])
                    ->orWhereBetween('fecha_fin', [$request->fecha_inicio, $request->fecha_fin])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('fecha_inicio', '<=', $request->fecha_inicio)
                          ->where('fecha_fin', '>=', $request->fecha_fin);
                    });
            })
            ->exists();

        if ($superposicion) {
            return response()->json([
                'error' => 'Ya existe una reserva en ese horario para este espacio'
            ], 409);
        }

        // Crear reserva
        $reserva = Reserva::create([
            'user_id' => auth('api')->id(),
            'espacio_id' => $request->espacio_id,
            'nombre_evento' => $request->nombre_evento,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'estado' => 'confirmada'
        ]);

        return response()->json([
            'mensaje' => 'Reserva creada exitosamente',
            'reserva' => $reserva->load('espacio')
        ], 201);
    }

    /**
     * Mostrar una reserva específica
     */
    public function show($id)
    {
        $reserva = Reserva::with('espacio')->find($id);

        if (!$reserva) {
            return response()->json(['error' => 'Reserva no encontrada'], 404);
        }

        // Verificar que la reserva pertenece al usuario
        if ($reserva->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($reserva);
    }

    /**
     * Actualizar reserva
     */
    public function update(Request $request, $id)
    {
        $reserva = Reserva::find($id);

        if (!$reserva) {
            return response()->json(['error' => 'Reserva no encontrada'], 404);
        }

        // Verificar que la reserva pertenece al usuario
        if ($reserva->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validador = Validator::make($request->all(), [
            'nombre_evento' => 'string|max:255',
            'fecha_inicio' => 'date|after:now',
            'fecha_fin' => 'date|after:fecha_inicio',
        ]);

        if ($validador->fails()) {
            return response()->json(['errores' => $validador->errors()], 422);
        }

        // Si se cambian las fechas, validar superposición
        if ($request->has('fecha_inicio') || $request->has('fecha_fin')) {
            $fechaInicio = $request->fecha_inicio ?? $reserva->fecha_inicio;
            $fechaFin = $request->fecha_fin ?? $reserva->fecha_fin;

            $superposicion = Reserva::where('espacio_id', $reserva->espacio_id)
                ->where('id', '!=', $id)
                ->where('estado', '!=', 'cancelada')
                ->where(function ($query) use ($fechaInicio, $fechaFin) {
                    $query->whereBetween('fecha_inicio', [$fechaInicio, $fechaFin])
                        ->orWhereBetween('fecha_fin', [$fechaInicio, $fechaFin])
                        ->orWhere(function ($q) use ($fechaInicio, $fechaFin) {
                            $q->where('fecha_inicio', '<=', $fechaInicio)
                              ->where('fecha_fin', '>=', $fechaFin);
                        });
                })
                ->exists();

            if ($superposicion) {
                return response()->json([
                    'error' => 'Ya existe una reserva en ese horario para este espacio'
                ], 409);
            }
        }

        $reserva->update($request->all());

        return response()->json([
            'mensaje' => 'Reserva actualizada exitosamente',
            'reserva' => $reserva->load('espacio')
        ]);
    }

    /**
     * Cancelar/eliminar reserva
     */
    public function destroy($id)
    {
        $reserva = Reserva::find($id);

        if (!$reserva) {
            return response()->json(['error' => 'Reserva no encontrada'], 404);
        }

        // Verificar que la reserva pertenece al usuario
        if ($reserva->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $reserva->update(['estado' => 'cancelada']);

        return response()->json(['mensaje' => 'Reserva cancelada exitosamente']);
    }
}