import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formularioLogin: FormGroup;
  cargando = false;
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  iniciarSesion(): void {
    if (this.formularioLogin.valid) {
      this.cargando = true;
      this.mensajeError = '';

      this.authService.login(this.formularioLogin.value).subscribe({
        next: () => {
          this.router.navigate(['/espacios']);
        },
        error: (error) => {
          this.cargando = false;
          this.mensajeError = error.error?.error || 'Error al iniciar sesión';
        }
      });
    }
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }
}