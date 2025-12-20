import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Espacio } from '../models/espacio.model';

@Injectable({
  providedIn: 'root'
})
export class EspacioService {
  private apiUrl = 'http://localhost:8000/api/espacios';

  constructor(private http: HttpClient) { }

  /**
   * Listar todos los espacios con filtros opcionales
   */
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

  /**
   * Obtener un espacio por ID
   */
  obtenerPorId(id: number): Observable<Espacio> {
    return this.http.get<Espacio>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nuevo espacio (requiere autenticación)
   */
  crear(espacio: Espacio): Observable<any> {
    return this.http.post(this.apiUrl, espacio);
  }

  /**
   * Actualizar espacio (requiere autenticación)
   */
  actualizar(id: number, espacio: Partial<Espacio>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, espacio);
  }

  /**
   * Eliminar espacio (requiere autenticación)
   */
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}