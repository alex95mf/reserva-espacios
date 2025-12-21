import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  formularioRegistro: FormGroup;
  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formularioRegistro = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registrarse(): void {
    if (this.formularioRegistro.valid) {
      this.cargando = true;
      this.mensajeError = '';
      this.mensajeExito = '';

      this.authService.registrar(this.formularioRegistro.value).subscribe({
        next: () => {
          this.mensajeExito = 'Cuenta creada exitosamente. Redirigiendo al login...';
          setTimeout(() => {
            this.router.navigate(['/iniciar-sesion']);
          }, 2000);
        },
        error: (error) => {
          this.cargando = false;
          this.mensajeError = error.error?.errores 
            ? JSON.stringify(error.error.errores) 
            : 'Error al crear la cuenta';
        }
      });
    }
  }

  irALogin(): void {
    this.router.navigate(['/iniciar-sesion']);
  }
}