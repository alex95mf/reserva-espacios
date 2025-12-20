<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar migración - crear tabla espacios
     */
    public function up(): void
    {
        Schema::create('espacios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->integer('capacidad');
            $table->string('tipo'); // Ej: sala reuniones, auditorio, etc
            $table->string('imagen_url')->nullable();
            $table->boolean('disponible')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Revertir migración - eliminar tabla espacios
     */
    public function down(): void
    {
        Schema::dropIfExists('espacios');
    }
};