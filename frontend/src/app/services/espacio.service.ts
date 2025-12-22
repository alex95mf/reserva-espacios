import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Espacio } from '../models/espacio.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspacioService {
  private apiUrl = `${environment.apiUrl}/espacios`;

  constructor(private http: HttpClient) {}

  listar(filtros?: {
    tipo?: string;
    disponible?: boolean;
    capacidad_minima?: number;
  }): Observable<Espacio[]> {
    let params = new HttpParams();

    if (filtros?.tipo) {
      params = params.set('tipo', filtros.tipo);
    }

    if (filtros?.disponible !== undefined) {
      params = params.set('disponible', filtros.disponible.toString());
    }

    if (filtros?.capacidad_minima) {
      params = params.set('capacidad_minima', filtros.capacidad_minima.toString());
    }

    return this.http.get<Espacio[]>(this.apiUrl, { params });
  }

  obtener(id: number): Observable<Espacio> {
    return this.http.get<Espacio>(`${this.apiUrl}/${id}`);
  }

  obtenerPorId(id: number): Observable<Espacio> {
    return this.obtener(id);
  }

  crear(espacio: Partial<Espacio>): Observable<Espacio> {
    return this.http.post<Espacio>(this.apiUrl, espacio);
  }

  actualizar(id: number, espacio: Partial<Espacio>): Observable<Espacio> {
    return this.http.put<Espacio>(`${this.apiUrl}/${id}`, espacio);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}