import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private messageService: MessageService) { }

  /**
   * Mostrar notificación de éxito
   */
  exito(titulo: string, mensaje: string, duracion: number = 3000): void {
    this.messageService.add({
      severity: 'success',
      summary: titulo,
      detail: mensaje,
      life: duracion
    });
  }

  /**
   * Mostrar notificación de error
   */
  error(titulo: string, mensaje: string, duracion: number = 5000): void {
    this.messageService.add({
      severity: 'error',
      summary: titulo,
      detail: mensaje,
      life: duracion
    });
  }

  /**
   * Mostrar notificación de advertencia
   */
  advertencia(titulo: string, mensaje: string, duracion: number = 4000): void {
    this.messageService.add({
      severity: 'warn',
      summary: titulo,
      detail: mensaje,
      life: duracion
    });
  }

  /**
   * Mostrar notificación informativa
   */
  info(titulo: string, mensaje: string, duracion: number = 3000): void {
    this.messageService.add({
      severity: 'info',
      summary: titulo,
      detail: mensaje,
      life: duracion
    });
  }

  /**
   * Limpiar todas las notificaciones
   */
  limpiar(): void {
    this.messageService.clear();
  }
}