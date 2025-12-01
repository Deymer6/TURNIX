import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {
  
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Obtener lista 
  getProfesionalesPorNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesionales/negocio/${negocioId}`);
  }

  // Obtener uno 
  getProfesionalById(profesionalId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profesionales/${profesionalId}`);
  }

  //Crear profesional
  crearProfesional(profesional: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profesionales`, profesional);
  }

  //Actualizar profesional
  actualizarProfesional(id: number, profesional: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profesionales/${id}`, profesional);
  }

  
  eliminarProfesional(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/profesionales/${id}`);
  }

  getProfesionalesByNegocioId(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesionales/negocio/${negocioId}`);
  }
}