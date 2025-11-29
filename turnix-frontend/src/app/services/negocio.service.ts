import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Negocio {
  id: number;
  nombreNegocio: string;
  descripcion?: string;
  direccion: string;
  ciudad: string;
  telefono?: string;
  tipo: string;
  calificacionPromedio?: number;
  precioMinimo?: number;
  imagenPrincipal?: string;
  
  nombre?: string;
  imagenUrl?: string;
  calificacion?: number;
  numeroResenas?: number;
}

export interface CrearNegocioDTO {
  nombreNegocio: string;
  direccion: string;
  telefonoNegocio?: string;
  descripcion?: string;
  horarioApertura: string; // Represent LocalTime as string (e.g., "HH:mm")
  horarioCierre: string; // Represent LocalTime as string (e.g., "HH:mm")
  ciudad: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}
  // 📥 Obtener todos los negocios
  obtenerNegocios(): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.baseUrl}/negocios`);
  }

  // 📥 Obtener un negocio por ID
  obtenerNegocioPorId(id: number): Observable<Negocio> {
    return this.http.get<Negocio>(`${this.baseUrl}/negocios/${id}`);
  }

  // 📥 Buscar negocios por ciudad
  buscarPorCiudad(ciudad: string): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.baseUrl}/negocios/ciudad/${ciudad}`);
  }

  // 📥 Buscar negocios por tipo
  buscarPorTipo(tipo: string): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.baseUrl}/negocios/tipo/${tipo}`);
  }
  obtenerDestacados(): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.baseUrl}/negocios/destacados`);
  }
  obtenerGaleriaPorNegocio(negocioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/galerias/negocio/${negocioId}`); 
  }

  // 📤 Crear un nuevo negocio
  crearNegocio(negocioData: CrearNegocioDTO): Observable<Negocio> {
    return this.http.post<Negocio>(`${this.baseUrl}/negocios`, negocioData);
  }
}