import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:8000/api/reservas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  crear(reserva: any): Observable<any> {
    return this.http.post(this.apiUrl, reserva);
  }

  actualizar(id: number, reserva: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, reserva);
  }

  cancelar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}