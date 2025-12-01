import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromocionService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

 
 getPromocionesPorNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/promociones/negocio/${negocioId}`);
  }

  getPromocionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/promociones/${id}`);
  }

  crearPromocion(promocion: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/promociones`, promocion);
  }

  actualizarPromocion(id: number, promocion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/promociones/${id}`, promocion);
  }

  eliminarPromocion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/promociones/${id}`);
  }
}