<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Ejecutar los seeders de la base de datos
     */
    public function run(): void
    {
        // Llamar al seeder de espacios
        $this->call([
            EspacioSeeder::class,
        ]);
    }
}