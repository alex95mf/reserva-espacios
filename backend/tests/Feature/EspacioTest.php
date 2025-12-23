<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Espacio;

class EspacioTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_listar_espacios()
    {
        Espacio::factory()->count(3)->create();

        $response = $this->getJson('/api/espacios');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    public function test_puede_filtrar_espacios_por_tipo()
    {
        Espacio::factory()->create(['tipo' => 'Sala de Conferencias']);
        Espacio::factory()->create(['tipo' => 'Auditorio']);

        $response = $this->getJson('/api/espacios?tipo=Auditorio');

        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    public function test_puede_filtrar_espacios_por_capacidad_minima()
    {
        Espacio::factory()->create(['capacidad' => 10]);
        Espacio::factory()->create(['capacidad' => 50]);

        $response = $this->getJson('/api/espacios?capacidad_minima=30');

        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    public function test_puede_obtener_un_espacio_especifico()
    {
        $espacio = Espacio::factory()->create();

        $response = $this->getJson("/api/espacios/{$espacio->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $espacio->id,
                     'nombre' => $espacio->nombre
                 ]);
    }

    public function test_usuario_autenticado_puede_crear_espacio()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')
                         ->postJson('/api/espacios', [
                             'nombre' => 'Sala Test',
                             'descripcion' => 'Descripción de prueba',
                             'capacidad' => 20,
                             'tipo' => 'Sala de Reuniones',
                             'imagen_url' => 'https://example.com/image.jpg',
                             'disponible' => true
                         ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'mensaje',
                     'espacio' => ['id', 'nombre', 'capacidad']
                 ]);

        $this->assertDatabaseHas('espacios', [
            'nombre' => 'Sala Test'
        ]);
    }

    public function test_crear_espacio_requiere_autenticacion()
    {
        $response = $this->postJson('/api/espacios', [
            'nombre' => 'Sala Test',
            'capacidad' => 20,
            'tipo' => 'Sala de Reuniones'
        ]);

        $response->assertStatus(401);
    }

    public function test_usuario_autenticado_puede_actualizar_espacio()
    {
        $user = User::factory()->create();
        $espacio = Espacio::factory()->create(['nombre' => 'Nombre Original']);

        $response = $this->actingAs($user, 'api')
                         ->putJson("/api/espacios/{$espacio->id}", [
                             'nombre' => 'Nombre Actualizado'
                         ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('espacios', [
            'id' => $espacio->id,
            'nombre' => 'Nombre Actualizado'
        ]);
    }

    public function test_usuario_autenticado_puede_eliminar_espacio()
    {
        $user = User::factory()->create();
        $espacio = Espacio::factory()->create();

        $response = $this->actingAs($user, 'api')
                         ->deleteJson("/api/espacios/{$espacio->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('espacios', [
            'id' => $espacio->id
        ]);
    }
}