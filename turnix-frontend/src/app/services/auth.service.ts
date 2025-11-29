import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

// Interfaces para los datos
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  hasNegocio: boolean;
  negocioIds?: number[]; // Nuevo campo
}

export interface AuthResponse {
  token: string;
  id: number;
  nombre: string;
  email: string;
  rol: string;
  hasNegocio: boolean;
  negocioIds?: number[]; // Nuevo campo
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL del Backend
  private apiUrl = 'http://localhost:8080/api/auth'; 

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          const user: Usuario = {
            id: response.id,
            nombre: response.nombre,
            email: response.email,
            rol: response.rol,
            hasNegocio: response.hasNegocio,
            negocioIds: response.negocioIds // Guardar negocioIds
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  // Registro (Opcional si lo usas aquí)
  registro(usuarioData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, usuarioData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  updateUserHasNegocioStatus(hasNegocio: boolean): void {
    const currentUser = this.currentUserSubject.getValue();
    if (currentUser) {
      const updatedUser = { ...currentUser, hasNegocio };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  hasRole(role: string): boolean {
    const currentUser = this.currentUserSubject.getValue();
    return currentUser?.rol === role;
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.getValue();
  }
}