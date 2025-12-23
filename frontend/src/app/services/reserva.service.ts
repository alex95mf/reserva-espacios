import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

  /**
   * Listar todas las reservas del usuario autenticado
   */
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtener una reserva específica por ID
   */
  obtener(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear una nueva reserva
   */
  crear(reserva: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reserva);
  }

  /**
   * Actualizar una reserva existente
   */
  actualizar(id: number, reserva: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, reserva);
  }

  /**
   * Cancelar/eliminar una reserva
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener reservas de un espacio específico (público)
   */
  obtenerPorEspacio(espacioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl.replace('/reservas', '')}/espacios/${espacioId}/reservas`);
  }
}