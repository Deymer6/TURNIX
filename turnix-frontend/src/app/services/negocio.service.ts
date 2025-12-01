import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Negocio {
  id: number;
  nombreNegocio: string;
  direccion: string;
  telefonoNegocio: string;
  descripcion: string;
  horarioApertura: string;
  horarioCierre: string;
  ciudad: string;
  tipo: string;
  imagenUrl?: string; 
  calificacionPromedio?: number;
}

export interface CrearNegocioDTO {
  nombreNegocio: string;
  direccion: string;
  telefonoNegocio?: string;
  descripcion?: string;
  horarioApertura: string;
  horarioCierre: string;
  ciudad: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  obtenerNegocios(): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.baseUrl}/negocios`);
  }

  obtenerNegocioPorId(id: number): Observable<Negocio> {
    return this.http.get<Negocio>(`${this.baseUrl}/negocios/${id}`);
  }

  buscarPorCiudad(ciudad: string): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.baseUrl}/negocios/ciudad/${ciudad}`);
  }

  buscarPorTipo(tipo: string): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.baseUrl}/negocios/tipo/${tipo}`);
  }

  obtenerDestacados(): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.baseUrl}/negocios/destacados`);
  }

  obtenerGaleriaPorNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/galerias/negocio/${negocioId}`); 
  }

  crearNegocio(negocioData: CrearNegocioDTO): Observable<Negocio> {
    return this.http.post<Negocio>(`${this.baseUrl}/negocios`, negocioData);
  }
}