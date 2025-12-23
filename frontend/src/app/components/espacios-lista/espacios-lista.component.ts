import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EspacioService } from '../../services/espacio.service';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { Espacio } from '../../models/espacio.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-espacios-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    DropdownModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './espacios-lista.component.html',
  styleUrl: './espacios-lista.component.css'
})
export class EspaciosListaComponent implements OnInit {
  espacios: Espacio[] = [];
  cargando = false;
  
  filtros: any = {
    tipo: undefined,
    capacidad_minima: undefined,
    disponible: undefined
  };

  tiposEspacio = [
    { label: 'Sala de Conferencias', value: 'Sala de Conferencias' },
    { label: 'Auditorio', value: 'Auditorio' },
    { label: 'Sala de Reuniones', value: 'Sala de Reuniones' },
    { label: 'Sala Ejecutiva', value: 'Sala Ejecutiva' },
    { label: 'Espacio Coworking', value: 'Espacio Coworking' }
  ];

  opcionesDisponibilidad = [
    { label: 'Disponible', value: true },
    { label: 'No disponible', value: false }
  ];
  
  mostrarModalReserva = false;
  espacioSeleccionado: Espacio | null = null;
  nombreEvento = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechaMinima = new Date();
  cargandoReserva = false;

  constructor(
    private espacioService: EspacioService,
    private reservaService: ReservaService,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  /**
   * Inicializar el componente
   */
  ngOnInit(): void {
    this.cargarEspacios();
  }

  /**
   * Cargar espacios desde la API
   */
  cargarEspacios(): void {
    this.cargando = true;
    this.espacioService.listar().subscribe({
      next: (espacios) => {
        this.espacios = espacios;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('error', 'Error', 'No se pudieron cargar los espacios');
      }
    });
  }

  /**
   * Aplicar filtros de búsqueda
   */
  aplicarFiltros(): void {
    this.cargando = true;
    this.espacioService.listar(this.filtros).subscribe({
      next: (espacios) => {
        this.espacios = espacios;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('error', 'Error', 'No se pudieron aplicar los filtros');
      }
    });
  }

  /**
   * Limpiar filtros y recargar todos los espacios
   */
  limpiarFiltros(): void {
    this.filtros = {
      tipo: null,
      capacidad_minima: null,
      disponible: null
    };
    this.cargarEspacios();
  }

  /**
   * Ver detalle de un espacio
   */
  verDetalle(espacio: Espacio): void {
    this.router.navigate(['/espacios/detalle', espacio.id]);
  }

  /**
   * Abrir modal de reserva
   */
  abrirModalReserva(espacio: Espacio): void {
    if (!this.authService.estaAutenticado()) {
      this.mostrarMensaje('warn', 'Advertencia', 'Debes iniciar sesión para reservar');
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    this.espacioSeleccionado = espacio;
    this.mostrarModalReserva = true;
    this.nombreEvento = '';
    this.fechaInicio = null;
    this.fechaFin = null;
  }

  /**
   * Cerrar modal de reserva
   */
  cerrarModal(): void {
    this.mostrarModalReserva = false;
  }

  /**
   * Crear nueva reserva
   */
  crearReserva(): void {
    if (!this.nombreEvento || !this.fechaInicio || !this.fechaFin) {
      this.mostrarMensaje('warn', 'Advertencia', 'Complete todos los campos');
      return;
    }

    this.cargandoReserva = true;
    
    const reserva = {
      espacio_id: this.espacioSeleccionado!.id!,
      nombre_evento: this.nombreEvento,
      fecha_inicio: this.formatearFechaParaAPI(this.fechaInicio),
      fecha_fin: this.formatearFechaParaAPI(this.fechaFin)
    };

    this.reservaService.crear(reserva).subscribe({
      next: () => {
        this.mostrarMensaje('success', 'Éxito', 'Reserva creada exitosamente');
        this.mostrarModalReserva = false;
        this.cargandoReserva = false;
      },
      error: (error) => {
        this.cargandoReserva = false;
        this.mostrarMensaje('error', 'Error', error.error?.error || 'No se pudo crear la reserva');
      }
    });
  }

  /**
   * Formatear fecha para enviar a la API
   */
  formatearFechaParaAPI(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Ver mis reservas
   */
  verMisReservas(): void {
    this.router.navigate(['/mis-reservas']);
  }

  /**
   * Mostrar mensaje toast
   */
  mostrarMensaje(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}