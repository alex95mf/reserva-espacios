<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Espacio extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'espacios';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'nombre',
        'descripcion',
        'capacidad',
        'tipo',
        'imagen_url',
        'disponible'
    ];

    // Conversión de tipos
    protected $casts = [
        'disponible' => 'boolean',
        'capacidad' => 'integer'
    ];

    /**
     * Relación: Un espacio tiene muchas reservas
     */
    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }
}