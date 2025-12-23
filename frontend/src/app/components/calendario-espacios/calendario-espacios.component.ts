import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { EspacioService } from '../../services/espacio.service';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import { Espacio } from '../../models/espacio.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-calendario-espacios',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    ToastModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './calendario-espacios.component.html',
  styleUrl: './calendario-espacios.component.css'
})
export class CalendarioEspaciosComponent implements OnInit {
  espacio: Espacio | null = null;
  espacioId: number = 0;
  cargando = false;
  
  mostrarModalReserva = false;
  nombreEvento = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  fechaSeleccionada: Date | null = null;
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '22:00:00',
    allDaySlot: false,
    height: 'auto',
    nowIndicator: true,
    selectable: true,
    selectMirror: true,
    weekends: true,
    editable: false,
    events: [],
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private espacioService: EspacioService,
    private reservaService: ReservaService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  /**
   * Inicializar el componente
   */
  ngOnInit(): void {
    this.espacioId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarEspacio();
    this.cargarReservas();
  }

  /**
   * Cargar información del espacio desde la API
   */
  cargarEspacio(): void {
    this.cargando = true;
    this.espacioService.obtener(this.espacioId).subscribe({
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
   * Cargar reservas del espacio y mostrarlas en el calendario
   */
  cargarReservas(): void {
    this.reservaService.obtenerPorEspacio(this.espacioId).subscribe({
      next: (reservas) => {
        const eventos = reservas
          .filter(r => r.estado !== 'cancelada')
          .map(reserva => ({
            title: reserva.nombre_evento,
            start: reserva.fecha_inicio,
            end: reserva.fecha_fin,
            backgroundColor: '#667eea',
            borderColor: '#764ba2',
            extendedProps: {
              reservaId: reserva.id
            }
          }));
        
        this.calendarOptions.events = eventos;
      },
      error: () => {
        this.mostrarMensaje('error', 'Error', 'No se pudieron cargar las reservas');
      }
    });
  }

  /**
   * Manejar selección de fecha/hora en el calendario
   */
  handleDateSelect(selectInfo: any): void {
    if (!this.authService.estaAutenticado()) {
      this.mostrarMensaje('warn', 'Advertencia', 'Debes iniciar sesión para reservar');
      this.router.navigate(['/iniciar-sesion']);
      return;
    }

    this.fechaSeleccionada = selectInfo.start;
    this.fechaInicio = new Date(selectInfo.start);
    this.fechaFin = new Date(selectInfo.end);
    this.nombreEvento = '';
    this.mostrarModalReserva = true;
  }

  /**
   * Manejar click en un evento del calendario
   */
  handleEventClick(clickInfo: any): void {
    const evento = clickInfo.event;
    this.mostrarMensaje('info', 'Reserva', `${evento.title}`);
  }

  /**
   * Crear nueva reserva desde el calendario
   */
  crearReserva(): void {
    if (!this.nombreEvento || !this.fechaInicio || !this.fechaFin) {
      this.mostrarMensaje('warn', 'Advertencia', 'Complete todos los campos');
      return;
    }

    const reserva = {
      espacio_id: this.espacioId,
      nombre_evento: this.nombreEvento,
      fecha_inicio: this.formatearFechaParaAPI(this.fechaInicio),
      fecha_fin: this.formatearFechaParaAPI(this.fechaFin)
    };

    this.reservaService.crear(reserva).subscribe({
      next: () => {
        this.mostrarMensaje('success', 'Éxito', 'Reserva creada exitosamente');
        this.mostrarModalReserva = false;
        this.cargarReservas();
      },
      error: (error) => {
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
   * Cerrar modal de reserva
   */
  cerrarModal(): void {
    this.mostrarModalReserva = false;
  }

  /**
   * Volver a la lista de espacios
   */
  volverALista(): void {
    this.router.navigate(['/espacios']);
  }

  /**
   * Mostrar mensaje toast
   */
  mostrarMensaje(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}