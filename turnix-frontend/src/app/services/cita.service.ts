import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }
  crearCita(citaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/citas`, citaData);
  }
  getCitasPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/citas/usuario/${usuarioId}`);
  }
  cancelarCita(citaId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/citas/${citaId}/cancelar`, {});
  }
}