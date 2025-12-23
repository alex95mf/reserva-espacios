<?php

namespace Database\Factories;

use App\Models\Espacio;
use Illuminate\Database\Eloquent\Factories\Factory;

class EspacioFactory extends Factory
{
    protected $model = Espacio::class;

    public function definition(): array
    {
        return [
            'nombre' => fake()->words(3, true),
            'descripcion' => fake()->sentence(10),
            'capacidad' => fake()->numberBetween(10, 100),
            'tipo' => fake()->randomElement([
                'Sala de Conferencias',
                'Auditorio',
                'Sala de Reuniones',
                'Sala Ejecutiva',
                'Espacio Coworking'
            ]),
            'imagen_url' => fake()->imageUrl(640, 480, 'business', true),
            'disponible' => fake()->boolean(80)
        ];
    }
}