<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_usuario_puede_registrarse()
    {
        $response = $this->postJson('/api/registrar', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'mensaje',
                     'usuario' => ['id', 'name', 'email']
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com'
        ]);
    }

    public function test_registro_falla_con_email_duplicado()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/registrar', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(422)
                 ->assertJsonStructure(['errores']);
    }

    public function test_usuario_puede_iniciar_sesion()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'access_token',
                     'token_type',
                     'expires_in',
                     'usuario'
                 ]);
    }

    public function test_login_falla_con_credenciales_invalidas()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'noexiste@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                 ->assertJson(['error' => 'Credenciales inválidas']);
    }

    public function test_usuario_autenticado_puede_obtener_su_perfil()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user, 'api')
                         ->getJson('/api/yo');

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $user->id,
                     'email' => $user->email
                 ]);
    }

    public function test_usuario_puede_cerrar_sesion()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')
                         ->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['mensaje' => 'Sesión cerrada exitosamente']);
    }
}