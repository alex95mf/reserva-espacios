import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:8000/api/reservas';

  constructor(private http: HttpClient) { }

  /**
   * Listar todas las reservas del usuario autenticado
   */
  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  /**
   * Obtener una reserva por ID
   */
  obtenerPorId(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nueva reserva
   */
  crear(reserva: Partial<Reserva>): Observable<any> {
    return this.http.post(this.apiUrl, reserva);
  }

  /**
   * Actualizar reserva
   */
  actualizar(id: number, reserva: Partial<Reserva>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, reserva);
  }

  /**
   * Cancelar/eliminar reserva
   */
  cancelar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}