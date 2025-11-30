import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CrearNegocioDTO {
  nombreNegocio: string;
  direccion: string;
  telefonoNegocio: string;
  descripcion: string;
  horarioApertura: string;
  horarioCierre: string;
  ciudad: string;
  tipo: string;
}

export interface Negocio {
  id: number;
  nombreNegocio: string;
  descripcion?: string;
  direccion?: string;
  telefonoNegocio?: string;
  horarioApertura?: string;
  horarioCierre?: string;
  ciudad?: string;
  tipo?: string;
  imagenUrl?: string;
  calificacionPromedio?: number;
  numeroResenas?: number;
}

export interface Servicio {
  id: number;
  nombreServicio: string;
  precio: number;
  duracionEstimada: number;
  negocio?: { id: number };
  selected?: boolean;
}

export interface Profesional {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  activo: boolean;
  negocio?: { id: number };
}

export interface Galeria {
  id: number;
  urlImagen: string;
  descripcion: string;
  negocio?: { id: number };
}

export interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  fechaCreacion: string;
  cliente?: { nombre: string; apellido: string };
  cita?: { negocio?: { id: number } };
}

export interface CitaRequestDTO {
  clienteId: number;
  negocioId: number;
  profesionalId: number;
  servicioId: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: string;
  precioFinal: number;
  notasPromocion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NegocioService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // === MÉTODOS ===

  // 1. Obtener todos los negocios (SOLUCIONA EL ERROR TS2551)
  obtenerNegocios(): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.apiUrl}/negocios`);
  }

  // 2. Crear negocio
  crearNegocio(negocio: CrearNegocioDTO): Observable<Negocio> {
    return this.http.post<Negocio>(`${this.apiUrl}/negocios`, negocio);
  }

  // 3. Obtener por ID
  obtenerNegocioPorId(id: number): Observable<Negocio> {
    return this.http.get<Negocio>(`${this.apiUrl}/negocios/${id}`);
  }

  // 4. Servicios
  obtenerServicios(negocioId: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios/negocio/${negocioId}`);
  }

  // 5. Galería
  obtenerGaleria(negocioId: number): Observable<Galeria[]> {
    return this.http.get<Galeria[]>(`${this.apiUrl}/galerias/negocio/${negocioId}`);
  }

  // 6. Profesionales
  obtenerProfesionales(negocioId: number): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`${this.apiUrl}/profesionales/negocio/${negocioId}`);
  }

  // 7. Reseñas
  obtenerResenas(negocioId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/resenas`).pipe(
      map(resenas => resenas.filter(r => r.cita?.negocio?.id === negocioId || true))
    );
  }

  // 8. Guardar Citas
  guardarCitas(citas: CitaRequestDTO[]): Observable<any[]> {
    const peticiones = citas.map(cita => 
      this.http.post(`${this.apiUrl}/citas`, cita)
    );
    return forkJoin(peticiones);
  }
}