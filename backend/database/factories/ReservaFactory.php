<?php

namespace Database\Factories;

use App\Models\Reserva;
use App\Models\User;
use App\Models\Espacio;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class ReservaFactory extends Factory
{
    protected $model = Reserva::class;

    public function definition(): array
    {
        $fechaInicio = Carbon::now()->addDays(fake()->numberBetween(1, 30))->setTime(
            fake()->numberBetween(8, 18),
            0,
            0
        );

        $fechaFin = $fechaInicio->copy()->addHours(fake()->numberBetween(1, 4));

        return [
            'user_id' => User::factory(),
            'espacio_id' => Espacio::factory(),
            'nombre_evento' => fake()->sentence(3),
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin,
            'estado' => 'confirmada'
        ];
    }
}