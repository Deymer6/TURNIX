import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// === DTOs Y TIPOS NECESARIOS PARA CREACIÓN (CORRECCIÓN) ===
// Basado en src/main/java/com/turnix/turnix_backend/model/TipoNegocio.java
export type TipoNegocio = 'Barbería' | 'Salón de Belleza';

// DTO para la creación de un negocio (Coincide con los campos que se envían al backend)
export interface CrearNegocioDTO {
  nombreNegocio: string;
  direccion: string;
  telefonoNegocio: string;
  descripcion: string;
  // LocalTime en Java se serializa como string (ej: "09:00:00")
  horarioApertura: string; 
  horarioCierre: string; 
  ciudad: string;
  tipo: TipoNegocio;
}
// ==========================================================

// === INTERFACES FLEXIBLES ===
// Adaptadas para leer tanto DTOs como Entidades de Spring Boot

export interface Negocio {
  id: number;
  nombreNegocio: string;
  descripcion?: string;
  direccion?: string;
  telefonoNegocio?: string;
  horarioApertura?: string;
  horarioCierre?: string;
  imagenUrl?: string; 
  calificacionPromedio?: number;
  numeroResenas?: number;
  precioMinimo?: number;
  ciudad?: string;
}

export interface Servicio {
  id: number;
  // Soporte para estructura plana o anidada
  negocioId?: number; 
  negocio?: { id: number }; 
  
  nombreServicio: string;
  precio: number;
  duracionEstimada: number;
  selected?: boolean; 
}

export interface Profesional {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
}

export interface Galeria {
  id: number;
  negocioId?: number;
  negocio?: { id: number };
  
  urlImagen: string;
  descripcion: string;
}

export interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  fechaCreacion?: string;
  
  // Las reseñas suelen venir vinculadas a una Cita o Negocio
  cita?: { negocio?: { id: number } };
  negocio?: { id: number };
  negocioId?: number;
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

  // --- HELPER PARA FILTRADO ROBUSTO ---
  // Verifica si un item pertenece al negocio, revisando todas las posibles ubicaciones del ID
  private coincideNegocioId(item: any, idBuscado: number): boolean {
    if (!item) return false;
    // 1. Caso DTO plano: item.negocioId
    if (item.negocioId && item.negocioId === idBuscado) return true;
    // 2. Caso Entidad JPA: item.negocio.id
    if (item.negocio && item.negocio.id === idBuscado) return true;
    // 3. Caso Reseña via Cita: item.cita.negocio.id
    if (item.cita && item.cita.negocio && item.cita.negocio.id === idBuscado) return true;
    
    return false;
  }

  // --- MÉTODOS ---

  // MÉTODO PARA CREAR NEGOCIO (CORRECCIÓN TS2339)
  public crearNegocio(negocio: CrearNegocioDTO): Observable<Negocio> {
    // El endpoint es POST /api/negocios
    return this.http.post<Negocio>(`${this.apiUrl}/negocios`, negocio);
  }

  obtenerNegocios(): Observable<Negocio[]> {
    return this.http.get<Negocio[]>(`${this.apiUrl}/negocios`);
  }

  obtenerNegocioPorId(id: number): Observable<Negocio> {
    return this.http.get<Negocio>(`${this.apiUrl}/negocios/${id}`);
  }

  // Filtro corregido para Servicios
  obtenerServicios(negocioId: number): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/servicios`).pipe(
      map(items => {
        console.log('Servicios crudos del backend:', items); // Para depuración
        return items.filter(item => this.coincideNegocioId(item, negocioId));
      })
    );
  }

  // Filtro corregido para Galería
  obtenerGaleria(negocioId: number): Observable<Galeria[]> {
    return this.http.get<Galeria[]>(`${this.apiUrl}/galerias`).pipe(
      map(items => items.filter(item => this.coincideNegocioId(item, negocioId)))
    );
  }

  // Profesionales (Si tu backend no filtra, mostramos todos o filtramos si hay relación)
  obtenerProfesionales(): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`${this.apiUrl}/profesionales`);
  }

  // Filtro corregido para Reseñas
  obtenerResenas(negocioId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/resenas`).pipe(
      map(items => items.filter(item => this.coincideNegocioId(item, negocioId)))
    );
  }

  guardarCitas(citas: CitaRequestDTO[]): Observable<any[]> {
    const peticiones = citas.map(cita => 
      this.http.post(`${this.apiUrl}/citas`, cita)
    );
    return forkJoin(peticiones);
  }
}