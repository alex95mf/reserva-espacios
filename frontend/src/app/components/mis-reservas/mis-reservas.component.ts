import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../models/reserva.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  cargando = false;

  constructor(
    private reservaService: ReservaService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
        this.mostrarMensaje('error', 'Error', 'No se pudieron cargar las reservas');
      }
    });
  }

  obtenerSeveridadEstado(estado: string): 'success' | 'warning' | 'danger' {
    switch (estado) {
      case 'confirmada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'danger';
      default:
        return 'warning';
    }
  }

  confirmarCancelacion(reserva: Reserva): void {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea cancelar la reserva para "${reserva.nombre_evento}"?`,
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        this.cancelarReserva(reserva);
      }
    });
  }

  cancelarReserva(reserva: Reserva): void {
    this.reservaService.cancelar(reserva.id!).subscribe({
      next: () => {
        this.mostrarMensaje('success', 'Éxito', 'Reserva cancelada exitosamente');
        this.cargarReservas();
      },
      error: () => {
        this.mostrarMensaje('error', 'Error', 'No se pudo cancelar la reserva');
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

  verEspacios(): void {
    this.router.navigate(['/espacios']);
  }

  mostrarMensaje(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}