<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Espacio;

class EspacioSeeder extends Seeder
{
    /**
     * Ejecutar seeder - crear espacios de prueba
     */
    public function run(): void
    {
        $espacios = [
            [
                'nombre' => 'Sala de Conferencias A',
                'descripcion' => 'Sala amplia equipada con proyector, pantalla y sistema de sonido. Ideal para presentaciones y conferencias.',
                'capacidad' => 50,
                'tipo' => 'Sala de Conferencias',
                'imagen_url' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
                'disponible' => true
            ],
            [
                'nombre' => 'Sala de Reuniones B',
                'descripcion' => 'Sala privada para reuniones pequeñas con mesa redonda y pizarra interactiva.',
                'capacidad' => 10,
                'tipo' => 'Sala de Reuniones',
                'imagen_url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                'disponible' => true
            ],
            [
                'nombre' => 'Auditorio Principal',
                'descripcion' => 'Auditorio de gran capacidad con escenario, iluminación profesional y sistema de audio avanzado.',
                'capacidad' => 200,
                'tipo' => 'Auditorio',
                'imagen_url' => 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
                'disponible' => true
            ],
            [
                'nombre' => 'Sala de Capacitación',
                'descripcion' => 'Sala equipada para talleres y capacitaciones con computadoras y mesas de trabajo.',
                'capacidad' => 30,
                'tipo' => 'Sala de Capacitación',
                'imagen_url' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
                'disponible' => true
            ],
            [
                'nombre' => 'Sala Ejecutiva',
                'descripcion' => 'Sala premium para reuniones ejecutivas con mobiliario de lujo y tecnología de punta.',
                'capacidad' => 8,
                'tipo' => 'Sala Ejecutiva',
                'imagen_url' => 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
                'disponible' => true
            ],
            [
                'nombre' => 'Sala de Juntas',
                'descripcion' => 'Sala formal para juntas directivas con mesa grande y sistema de videoconferencia.',
                'capacidad' => 15,
                'tipo' => 'Sala de Juntas',
                'imagen_url' => 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800',
                'disponible' => false
            ]
        ];

        foreach ($espacios as $espacio) {
            Espacio::create($espacio);
        }
    }
}