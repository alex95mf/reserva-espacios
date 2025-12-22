import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EspacioService } from '../../services/espacio';
import { ReservaService } from '../../services/reserva';
import { AuthService } from '../../services/auth';
import { Espacio } from '../../models/espacio.model';

@Component({
  selector: 'app-espacio-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    ImageModule,
    DialogModule,
    CalendarModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './espacio-detalle.component.html',
  styleUrl: './espacio-detalle.component.css'
})
export class EspacioDetalleComponent implements OnInit {
  espacio: Espacio | null = null;
  cargando = false;
  espacioId: number = 0;

  // Modal de reserva
  mostrarModalReserva = false;
  nombreEvento = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  cargandoReserva = false;
  fechaMinima = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private espacioService: EspacioService,
    private reservaService: ReservaService,
    public authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.espacioId = +params['id'];
      this.cargarEspacio();
    });
  }

  /**
   * Cargar información del espacio
   */
  cargarEspacio(): void {
    this.cargando = true;
    this.espacioService.obtenerPorId(this.espacioId).subscribe({
      next: (espacio) => {
        this.espacio = espacio;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('error', 'Error', 'No se pudo cargar el espacio');
        this.router.navigate(['/espacios']);
      }
    });
  }

  /**
   * Abrir modal de reserva
   */
  abrirModalReserva(): void {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    this.mostrarModalReserva = true;
  }

  /**
   * Cerrar modal de reserva
   */
  cerrarModalReserva(): void {
    this.mostrarModalReserva = false;
    this.nombreEvento = '';
    this.fechaInicio = null;
    this.fechaFin = null;
  }

  /**
   * Crear reserva
   */
  crearReserva(): void {
    if (!this.nombreEvento || !this.fechaInicio || !this.fechaFin) {
      this.mostrarMensaje('warn', 'Advertencia', 'Complete todos los campos');
      return;
    }

    if (this.fechaFin <= this.fechaInicio) {
      this.mostrarMensaje('warn', 'Advertencia', 'La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    this.cargandoReserva = true;

    const reservaData = {
      espacio_id: this.espacioId,
      nombre_evento: this.nombreEvento,
      fecha_inicio: this.fechaInicio.toISOString(),
      fecha_fin: this.fechaFin.toISOString()
    };

    this.reservaService.crear(reservaData).subscribe({
      next: () => {
        this.cargandoReserva = false;
        this.mostrarMensaje('success', 'Éxito', 'Reserva creada exitosamente');
        this.cerrarModalReserva();
      },
      error: (error) => {
        this.cargandoReserva = false;
        const mensaje = error.error?.error || 'No se pudo crear la reserva';
        this.mostrarMensaje('error', 'Error', mensaje);
      }
    });
  }

  /**
   * Volver a la lista de espacios
   */
  volverALista(): void {
    this.router.navigate(['/espacios']);
  }

  /**
   * Obtener severidad del tag según disponibilidad
   */
  obtenerSeveridadDisponibilidad(disponible: boolean): 'success' | 'danger' {
    return disponible ? 'success' : 'danger';
  }

  /**
   * Mostrar mensaje toast
   */
  mostrarMensaje(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}