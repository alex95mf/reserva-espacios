import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EspacioService } from '../../services/espacio';
import { ReservaService } from '../../services/reserva';
import { AuthService } from '../../services/auth';
import { Espacio } from '../../models/espacio.model';

@Component({
  selector: 'app-espacios-lista',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './espacios-lista.html',
  styleUrl: './espacios-lista.css'
})
export class EspaciosLista implements OnInit {
  espacios: Espacio[] = [];
  espaciosFiltrados: Espacio[] = [];
  cargando = false;
  
  // Filtros
  tiposUnicos: string[] = [];
  tipoSeleccionado: string = '';
  capacidadMinima: number | null = null;
  soloDisponibles = false;

  // Modal de reserva
  mostrarModalReserva = false;
  espacioSeleccionado: Espacio | null = null;
  nombreEvento = '';
  fechaInicio = '';
  fechaFin = '';
  cargandoReserva = false;
  mensajeToast = '';
  tipoToast: 'success' | 'error' = 'success';
  mostrarToast = false;

  constructor(
    private espacioService: EspacioService,
    private reservaService: ReservaService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEspacios();
  }

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
        this.mostrarMensaje('No se pudieron cargar los espacios', 'error');
      }
    });
  }

  extraerTiposUnicos(): void {
    const tipos = this.espacios.map(e => e.tipo);
    this.tiposUnicos = [...new Set(tipos)];
  }

  aplicarFiltros(): void {
    this.espaciosFiltrados = this.espacios.filter(espacio => {
      const cumpleTipo = !this.tipoSeleccionado || espacio.tipo === this.tipoSeleccionado;
      const cumpleCapacidad = !this.capacidadMinima || espacio.capacidad >= this.capacidadMinima;
      const cumpleDisponible = !this.soloDisponibles || espacio.disponible;
      
      return cumpleTipo && cumpleCapacidad && cumpleDisponible;
    });
  }

  limpiarFiltros(): void {
    this.tipoSeleccionado = '';
    this.capacidadMinima = null;
    this.soloDisponibles = false;
    this.espaciosFiltrados = this.espacios;
  }

  abrirModalReserva(espacio: Espacio): void {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    this.espacioSeleccionado = espacio;
    this.mostrarModalReserva = true;
    this.nombreEvento = '';
    this.fechaInicio = '';
    this.fechaFin = '';
  }

  cerrarModal(): void {
    this.mostrarModalReserva = false;
  }

  crearReserva(): void {
    if (!this.espacioSeleccionado || !this.nombreEvento || !this.fechaInicio || !this.fechaFin) {
      this.mostrarMensaje('Complete todos los campos', 'error');
      return;
    }

    this.cargandoReserva = true;
    
    const reserva = {
      espacio_id: this.espacioSeleccionado.id!,
      nombre_evento: this.nombreEvento,
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin
    };

    this.reservaService.crear(reserva).subscribe({
      next: () => {
        this.mostrarMensaje('Reserva creada exitosamente', 'success');
        this.mostrarModalReserva = false;
        this.cargandoReserva = false;
      },
      error: (error) => {
        this.cargandoReserva = false;
        this.mostrarMensaje(error.error?.error || 'No se pudo crear la reserva', 'error');
      }
    });
  }

  verMisReservas(): void {
    this.router.navigate(['/mis-reservas']);
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