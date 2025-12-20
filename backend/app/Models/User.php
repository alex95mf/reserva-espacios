<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * Campos que se pueden asignar masivamente
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Campos ocultos en arrays
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Conversión de tipos
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Obtener identificador JWT
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Obtener claims personalizados JWT
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Relación: Un usuario tiene muchas reservas
     */
    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }
}