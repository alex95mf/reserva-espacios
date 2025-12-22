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
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-espacios-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    DialogModule,
    CalendarModule,
    InputTextModule,
    ToastModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './espacios-lista.component.html',
  styleUrl: './espacios-lista.component.css'
})
export class EspaciosListaComponent implements OnInit {
  espacios: Espacio[] = [];
  espaciosFiltrados: Espacio[] = [];
  cargando = false;
  
  // Filtros
  tiposUnicos: any[] = [];
  tipoSeleccionado: string = '';
  capacidadMinima: number | null = null;
  soloDisponibles = false;

  // Modal de reserva
  mostrarModalReserva = false;
  espacioSeleccionado: Espacio | null = null;
  nombreEvento = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  cargandoReserva = false;
  fechaMinima = new Date();

  constructor(
    private espacioService: EspacioService,
    private reservaService: ReservaService,
    public authService: AuthService,
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
   * Cargar todos los espacios desde el backend
   */
  cargarEspacios(): void {
    this.cargando = true;
    this.espacioService.listar().subscribe({
      next: (espacios) => {
        this.espacios = espacios;
        this.espaciosFiltrados = espacios;
        this.extraerTiposUnicos();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('error', 'Error', 'No se pudieron cargar los espacios');
      }
    });
  }

  /**
   * Extraer tipos únicos de espacios para el filtro
   */
  extraerTiposUnicos(): void {
    const tipos = [...new Set(this.espacios.map(e => e.tipo))];
    this.tiposUnicos = tipos.map(tipo => ({ label: tipo, value: tipo }));
  }

  /**
   * Aplicar filtros a la lista de espacios
   */
  aplicarFiltros(): void {
    this.espaciosFiltrados = this.espacios.filter(espacio => {
      const cumpleTipo = !this.tipoSeleccionado || espacio.tipo === this.tipoSeleccionado;
      const cumpleCapacidad = !this.capacidadMinima || espacio.capacidad >= this.capacidadMinima;
      const cumpleDisponible = !this.soloDisponibles || espacio.disponible;
      
      return cumpleTipo && cumpleCapacidad && cumpleDisponible;
    });
  }

  /**
   * Limpiar todos los filtros aplicados
   */
  limpiarFiltros(): void {
    this.tipoSeleccionado = '';
    this.capacidadMinima = null;
    this.soloDisponibles = false;
    this.espaciosFiltrados = this.espacios;
  }

  /**
   * Navegar al detalle del espacio
   */
  verDetalle(espacio: Espacio): void {
    this.router.navigate(['/espacios/detalle', espacio.id]);
  }

  /**
   * Abrir modal para crear una reserva
   */
  abrirModalReserva(espacio: Espacio): void {
    if (!this.authService.estaAutenticado()) {
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
   * Crear una nueva reserva
   */
  crearReserva(): void {
    if (!this.espacioSeleccionado || !this.nombreEvento || !this.fechaInicio || !this.fechaFin) {
      this.mostrarMensaje('warn', 'Advertencia', 'Complete todos los campos');
      return;
    }

    this.cargandoReserva = true;
    
    const reserva = {
      espacio_id: this.espacioSeleccionado.id!,
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
   * Navegar a la página de mis reservas
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