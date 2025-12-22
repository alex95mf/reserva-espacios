import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrl: './barra-navegacion.component.css'
})
export class BarraNavegacionComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  nombreUsuario: string = '';
  estaAutenticado: boolean = false;
  private suscripciones: Subscription[] = [];

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  /**
   * Inicializar el componente y suscribirse a los observables
   */
  ngOnInit(): void {
    // Suscribirse al estado del usuario actual
    const usuarioSub = this.authService.usuarioActual$.subscribe(usuario => {
      if (usuario) {
        this.nombreUsuario = usuario.name;
        this.items = [
          {
            label: 'Espacios',
            icon: 'pi pi-building',
            command: () => this.router.navigate(['/espacios'])
          },
          {
            label: 'Mis Reservas',
            icon: 'pi pi-calendar',
            command: () => this.router.navigate(['/mis-reservas'])
          },
          {
            label: 'Gestión de Espacios',
            icon: 'pi pi-cog',
            command: () => this.router.navigate(['/administracion/espacios'])
          }
        ];
      } else {
        this.nombreUsuario = '';
        this.items = [
          {
            label: 'Espacios',
            icon: 'pi pi-building',
            command: () => this.router.navigate(['/espacios'])
          }
        ];
      }
    });

    // Suscribirse al estado de autenticación
    const authSub = this.authService.autenticado$.subscribe(autenticado => {
      this.estaAutenticado = autenticado;
    });

    // Guardar las suscripciones para limpiarlas después
    this.suscripciones.push(usuarioSub, authSub);
  }

  /**
   * Limpiar suscripciones al destruir el componente
   */
  ngOnDestroy(): void {
    this.suscripciones.forEach(sub => sub.unsubscribe());
  }

  /**
   * Navegar a la página de iniciar sesión
   */
  irIniciarSesion(): void {
    this.router.navigate(['/iniciar-sesion']);
  }

  /**
   * Navegar a la página de registro
   */
  irRegistro(): void {
    this.router.navigate(['/registro']);
  }

  /**
   * Cerrar sesión del usuario y redirigir a espacios
   */
  cerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/espacios']);
      },
      error: () => {
        // Aun con error, redirigir a espacios
        this.router.navigate(['/espacios']);
      }
    });
  }
}