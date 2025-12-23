<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Espacio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservaController extends Controller
{
    /**
     * @OA\Get(
     *     path="/reservas",
     *     summary="Listar reservas del usuario autenticado",
     *     tags={"Reservas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Lista de reservas del usuario",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="espacio_id", type="integer"),
     *             @OA\Property(property="nombre_evento", type="string"),
     *             @OA\Property(property="fecha_inicio", type="string", format="date-time"),
     *             @OA\Property(property="fecha_fin", type="string", format="date-time"),
     *             @OA\Property(property="estado", type="string"),
     *             @OA\Property(property="espacio", type="object")
     *         ))
     *     ),
     *     @OA\Response(response=401, description="No autenticado")
     * )
     */
    public function index()
    {
        $reservas = auth('api')->user()->reservas()->with('espacio')->get();
        return response()->json($reservas);
    }

    /**
     * @OA\Post(
     *     path="/reservas",
     *     summary="Crear nueva reserva",
     *     tags={"Reservas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"espacio_id","nombre_evento","fecha_inicio","fecha_fin"},
     *             @OA\Property(property="espacio_id", type="integer", example=1),
     *             @OA\Property(property="nombre_evento", type="string", example="Reunión de equipo"),
     *             @OA\Property(property="fecha_inicio", type="string", format="date-time", example="2025-12-25 10:00:00"),
     *             @OA\Property(property="fecha_fin", type="string", format="date-time", example="2025-12-25 12:00:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Reserva creada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="mensaje", type="string"),
     *             @OA\Property(property="reserva", type="object")
     *         )
     *     ),
     *     @OA\Response(response=400, description="Espacio no disponible"),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=409, description="Superposición de horarios"),
     *     @OA\Response(response=422, description="Errores de validación")
     * )
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

        $espacio = Espacio::find($request->espacio_id);
        if (!$espacio->disponible) {
            return response()->json(['error' => 'El espacio no está disponible'], 400);
        }

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
     * @OA\Get(
     *     path="/reservas/{id}",
     *     summary="Obtener una reserva específica",
     *     tags={"Reservas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la reserva",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detalles de la reserva",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="espacio_id", type="integer"),
     *             @OA\Property(property="nombre_evento", type="string"),
     *             @OA\Property(property="fecha_inicio", type="string", format="date-time"),
     *             @OA\Property(property="fecha_fin", type="string", format="date-time"),
     *             @OA\Property(property="estado", type="string"),
     *             @OA\Property(property="espacio", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=403, description="No autorizado"),
     *     @OA\Response(response=404, description="Reserva no encontrada")
     * )
     */
    public function show($id)
    {
        $reserva = Reserva::with('espacio')->find($id);

        if (!$reserva) {
            return response()->json(['error' => 'Reserva no encontrada'], 404);
        }

        if ($reserva->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        return response()->json($reserva);
    }

    /**
     * @OA\Put(
     *     path="/reservas/{id}",
     *     summary="Actualizar una reserva",
     *     tags={"Reservas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la reserva",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="nombre_evento", type="string"),
     *             @OA\Property(property="fecha_inicio", type="string", format="date-time"),
     *             @OA\Property(property="fecha_fin", type="string", format="date-time")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reserva actualizada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="mensaje", type="string"),
     *             @OA\Property(property="reserva", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=403, description="No autorizado"),
     *     @OA\Response(response=404, description="Reserva no encontrada"),
     *     @OA\Response(response=409, description="Superposición de horarios"),
     *     @OA\Response(response=422, description="Errores de validación")
     * )
     */
    public function update(Request $request, $id)
    {
        $reserva = Reserva::find($id);

        if (!$reserva) {
            return response()->json(['error' => 'Reserva no encontrada'], 404);
        }

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
     * @OA\Delete(
     *     path="/reservas/{id}",
     *     summary="Cancelar/eliminar una reserva",
     *     tags={"Reservas"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de la reserva",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Reserva cancelada exitosamente",
     *         @OA\JsonContent(
     *             @OA\Property(property="mensaje", type="string", example="Reserva cancelada exitosamente")
     *         )
     *     ),
     *     @OA\Response(response=401, description="No autenticado"),
     *     @OA\Response(response=403, description="No autorizado"),
     *     @OA\Response(response=404, description="Reserva no encontrada")
     * )
     */
    public function destroy($id)
    {
        $reserva = Reserva::find($id);

        if (!$reserva) {
            return response()->json(['error' => 'Reserva no encontrada'], 404);
        }

        if ($reserva->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $reserva->update(['estado' => 'cancelada']);

        return response()->json(['mensaje' => 'Reserva cancelada exitosamente']);
    }
    
    /**
     * @OA\Get(
     *     path="/espacios/{id}/reservas",
     *     summary="Obtener reservas de un espacio específico (público)",
     *     tags={"Reservas"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID del espacio",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista de reservas del espacio",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id", type="integer"),
     *             @OA\Property(property="nombre_evento", type="string"),
     *             @OA\Property(property="fecha_inicio", type="string", format="date-time"),
     *             @OA\Property(property="fecha_fin", type="string", format="date-time"),
     *             @OA\Property(property="estado", type="string")
     *         ))
     *     )
     * )
     */
    public function reservasPorEspacio($espacioId)
    {
        $reservas = Reserva::where('espacio_id', $espacioId)
            ->where('estado', '!=', 'cancelada')
            ->select('id', 'nombre_evento', 'fecha_inicio', 'fecha_fin', 'estado', 'user_id')
            ->get();

        return response()->json($reservas);
    }
}