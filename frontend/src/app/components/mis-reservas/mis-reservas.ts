import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva';
import { Reserva } from '../../models/reserva.model';

@Component({
  selector: 'app-mis-reservas',
  imports: [
    CommonModule
  ],
  templateUrl: './mis-reservas.html',
  styleUrl: './mis-reservas.css'
})
export class MisReservas implements OnInit {
  reservas: Reserva[] = [];
  cargando = false;
  mensajeToast = '';
  tipoToast: 'success' | 'error' = 'success';
  mostrarToast = false;
  mostrarModalConfirmacion = false;
  reservaACancelar: Reserva | null = null;

  constructor(
    private reservaService: ReservaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando = true;
    this.reservaService.listar().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('No se pudieron cargar las reservas', 'error');
      }
    });
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'confirmada':
        return 'bg-success';
      case 'pendiente':
        return 'bg-warning';
      case 'cancelada':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  confirmarCancelacion(reserva: Reserva): void {
    this.reservaACancelar = reserva;
    this.mostrarModalConfirmacion = true;
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;
    this.reservaACancelar = null;
  }

  cancelarReserva(): void {
    if (!this.reservaACancelar) return;

    this.reservaService.cancelar(this.reservaACancelar.id!).subscribe({
      next: () => {
        this.mostrarMensaje('Reserva cancelada exitosamente', 'success');
        this.cerrarModalConfirmacion();
        this.cargarReservas();
      },
      error: () => {
        this.mostrarMensaje('No se pudo cancelar la reserva', 'error');
        this.cerrarModalConfirmacion();
      }
    });
  }

  volverAEspacios(): void {
    this.router.navigate(['/espacios']);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.mensajeToast = mensaje;
    this.tipoToast = tipo;
    this.mostrarToast = true;
    setTimeout(() => {
      this.mostrarToast = false;
    }, 3000);
  }
}