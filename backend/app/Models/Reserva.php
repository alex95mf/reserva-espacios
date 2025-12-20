<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'reservas';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'user_id',
        'espacio_id',
        'nombre_evento',
        'fecha_inicio',
        'fecha_fin',
        'estado'
    ];

    // Conversión de tipos
    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime'
    ];

    /**
     * Relación: Una reserva pertenece a un usuario
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relación: Una reserva pertenece a un espacio
     */
    public function espacio()
    {
        return $this->belongsTo(Espacio::class);
    }
}