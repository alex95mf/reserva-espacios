import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  usuario: User | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.usuarioActual$.subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  login(): void {
    this.router.navigate(['/iniciar-sesion']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/iniciar-sesion']);
      }
    });
  }
}