import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }
  getServiciosPorNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/servicios/negocio/${negocioId}`);
  }
  getServicioById(servicioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/servicios/${servicioId}`);
  }
  getCitasPorNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/citas/negocio/${negocioId}`);
  }

  crearServicio(servicio: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/servicios`, servicio);
  }

 
  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/servicios/${id}`);
  }
  
  actualizarServicio(id: number, servicio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/servicios/${id}`, servicio);
  }

  getServiciosByNegocioId(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/servicios/negocio/${negocioId}`);
  }
  
}