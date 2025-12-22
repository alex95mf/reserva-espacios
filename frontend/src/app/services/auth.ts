import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  
  // BehaviorSubject para gestionar el estado del usuario actual
  private usuarioSubject = new BehaviorSubject<User | null>(null);
  public usuarioActual$ = this.usuarioSubject.asObservable();
  
  // BehaviorSubject para gestionar el estado de autenticación
  private autenticadoSubject = new BehaviorSubject<boolean>(false);
  public autenticado$ = this.autenticadoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarUsuarioDesdeToken();
  }

  /**
   * Registrar nuevo usuario
   */
  registrar(datos: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, datos);
  }

  /**
   * Iniciar sesión
   */
  login(credenciales: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        this.usuarioSubject.next(response.usuario);
        this.autenticadoSubject.next(true);
      }),
      catchError(error => {
        this.autenticadoSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.limpiarSesion();
      }),
      catchError(() => {
        // Aunque falle el backend, limpiamos localmente
        this.limpiarSesion();
        return of(null);
      })
    );
  }

  /**
   * Obtener usuario autenticado
   */
  obtenerUsuarioActual(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/yo`).pipe(
      tap(usuario => {
        this.usuarioSubject.next(usuario);
        this.autenticadoSubject.next(true);
      }),
      catchError(error => {
        this.limpiarSesion();
        throw error;
      })
    );
  }

  /**
   * Verificar si el usuario está autenticado
   */
  estaAutenticado(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Obtener token de localStorage
   */
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtener el usuario actual de forma síncrona
   */
  obtenerUsuarioSincrono(): User | null {
    return this.usuarioSubject.value;
  }

  /**
   * Limpiar toda la sesión (token y estado)
   */
  private limpiarSesion(): void {
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
    this.autenticadoSubject.next(false);
  }

  /**
   * Cargar usuario desde token al iniciar la app
   */
  private cargarUsuarioDesdeToken(): void {
    if (this.estaAutenticado()) {
      this.obtenerUsuarioActual().subscribe({
        error: () => {
          this.limpiarSesion();
        }
      });
    }
  }
}