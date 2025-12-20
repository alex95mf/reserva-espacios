import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'auth_token';
  
  private usuarioActualSubject = new BehaviorSubject<User | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();

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
        this.guardarToken(response.access_token);
        this.usuarioActualSubject.next(response.usuario);
      })
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.eliminarToken();
        this.usuarioActualSubject.next(null);
      })
    );
  }

  /**
   * Obtener usuario autenticado
   */
  obtenerUsuarioActual(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/yo`).pipe(
      tap(usuario => this.usuarioActualSubject.next(usuario))
    );
  }

  /**
   * Guardar token en localStorage
   */
  private guardarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtener token de localStorage
   */
  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Eliminar token de localStorage
   */
  private eliminarToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  /**
   * Cargar usuario desde token al iniciar la app
   */
  private cargarUsuarioDesdeToken(): void {
    if (this.estaAutenticado()) {
      this.obtenerUsuarioActual().subscribe({
        error: () => this.eliminarToken()
      });
    }
  }
}