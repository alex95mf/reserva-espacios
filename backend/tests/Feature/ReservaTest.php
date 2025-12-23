<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Espacio;
use App\Models\Reserva;
use Carbon\Carbon;

class ReservaTest extends TestCase
{
    use RefreshDatabase;

    public function test_usuario_autenticado_puede_crear_reserva()
    {
        $user = User::factory()->create();
        $espacio = Espacio::factory()->create(['disponible' => true]);

        $fechaInicio = Carbon::now()->addDays(2);
        $fechaFin = Carbon::now()->addDays(2)->addHours(2);

        $response = $this->actingAs($user, 'api')
                         ->postJson('/api/reservas', [
                             'espacio_id' => $espacio->id,
                             'nombre_evento' => 'Reunión de prueba',
                             'fecha_inicio' => $fechaInicio->format('Y-m-d H:i:s'),
                             'fecha_fin' => $fechaFin->format('Y-m-d H:i:s')
                         ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'mensaje',
                     'reserva' => ['id', 'nombre_evento', 'espacio_id']
                 ]);

        $this->assertDatabaseHas('reservas', [
            'nombre_evento' => 'Reunión de prueba',
            'user_id' => $user->id
        ]);
    }

    public function test_crear_reserva_requiere_autenticacion()
    {
        $espacio = Espacio::factory()->create();

        $response = $this->postJson('/api/reservas', [
            'espacio_id' => $espacio->id,
            'nombre_evento' => 'Reunión de prueba',
            'fecha_inicio' => Carbon::now()->addDay(),
            'fecha_fin' => Carbon::now()->addDay()->addHours(2)
        ]);

        $response->assertStatus(401);
    }

    public function test_no_permite_reservas_con_superposicion_de_horarios()
    {
        $user = User::factory()->create();
        $espacio = Espacio::factory()->create(['disponible' => true]);

        $fechaInicio = Carbon::now()->addDays(2)->setTime(10, 0);
        $fechaFin = Carbon::now()->addDays(2)->setTime(12, 0);

        Reserva::factory()->create([
            'espacio_id' => $espacio->id,
            'fecha_inicio' => $fechaInicio,
            'fecha_fin' => $fechaFin
        ]);

        $response = $this->actingAs($user, 'api')
                         ->postJson('/api/reservas', [
                             'espacio_id' => $espacio->id,
                             'nombre_evento' => 'Reserva superpuesta',
                             'fecha_inicio' => $fechaInicio->copy()->addMinutes(30)->format('Y-m-d H:i:s'),
                             'fecha_fin' => $fechaFin->copy()->addHour()->format('Y-m-d H:i:s')
                         ]);

        $response->assertStatus(409)
                 ->assertJson([
                     'error' => 'Ya existe una reserva en ese horario para este espacio'
                 ]);
    }

    public function test_usuario_puede_ver_sus_reservas()
    {
        $user = User::factory()->create();
        $otroUser = User::factory()->create();
        
        Reserva::factory()->count(2)->create(['user_id' => $user->id]);
        Reserva::factory()->create(['user_id' => $otroUser->id]);

        $response = $this->actingAs($user, 'api')
                         ->getJson('/api/reservas');

        $response->assertStatus(200)
                 ->assertJsonCount(2);
    }

    public function test_usuario_puede_ver_detalle_de_su_reserva()
    {
        $user = User::factory()->create();
        $reserva = Reserva::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')
                         ->getJson("/api/reservas/{$reserva->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $reserva->id,
                     'nombre_evento' => $reserva->nombre_evento
                 ]);
    }

    public function test_usuario_no_puede_ver_reserva_de_otro_usuario()
    {
        $user = User::factory()->create();
        $otroUser = User::factory()->create();
        $reserva = Reserva::factory()->create(['user_id' => $otroUser->id]);

        $response = $this->actingAs($user, 'api')
                         ->getJson("/api/reservas/{$reserva->id}");

        $response->assertStatus(403);
    }

    public function test_usuario_puede_cancelar_su_reserva()
    {
        $user = User::factory()->create();
        $reserva = Reserva::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'api')
                         ->deleteJson("/api/reservas/{$reserva->id}");

        $response->assertStatus(200)
                 ->assertJson(['mensaje' => 'Reserva cancelada exitosamente']);
    }

    public function test_usuario_no_puede_cancelar_reserva_de_otro_usuario()
    {
        $user = User::factory()->create();
        $otroUser = User::factory()->create();
        $reserva = Reserva::factory()->create(['user_id' => $otroUser->id]);

        $response = $this->actingAs($user, 'api')
                         ->deleteJson("/api/reservas/{$reserva->id}");

        $response->assertStatus(403);
    }
}