<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecutar migración - crear tabla reservas
     */
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('espacio_id')->constrained('espacios')->onDelete('cascade');
            $table->string('nombre_evento');
            $table->dateTime('fecha_inicio');
            $table->dateTime('fecha_fin');
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada'])->default('confirmada');
            $table->timestamps();
        });
    }

    /**
     * Revertir migración - eliminar tabla reservas
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};