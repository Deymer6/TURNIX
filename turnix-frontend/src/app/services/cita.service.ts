import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  // Asegúrate de que este puerto sea el correcto (8080)
  private apiUrl = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) { }

  //  Obtener citas por Negocio
  getCitasPorNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/negocio/${negocioId}`);
  }

  //  Crear Cita
  crearCita(citaData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, citaData);
  }

  // Editar Cita (Faltaba pulir este)
  actualizarCita(id: number, citaData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, citaData);
  }

  //  Eliminar Cita
  eliminarCita(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}