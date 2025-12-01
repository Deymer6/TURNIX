import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {
  
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }
 
  private getHorarioSemanal(profesionalId: number, diaSemana: number): Observable<any> {
    // ✅ CORREGIDO: Cambiado de 'disponibilidades' a 'disponibilidad'
    return this.http.get<any[]>(`${this.apiUrl}/disponibilidad?profesionalId=${profesionalId}&diaSemana=${diaSemana}`)
      .pipe(
        map(resp => (resp && resp.length > 0) ? resp[0] : null)
      );
  }

  private getCitasEnFecha(profesionalId: number, fecha: string): Observable<any[]> {
    // Esta ruta está bien si tu CitaController soporta filtros por fecha.
    // Si no, tendremos que ajustar el backend de Citas también.
    return this.http.get<any[]>(`${this.apiUrl}/citas?profesionalId=${profesionalId}&fecha=${fecha}`);
  }

  getHorariosDisponibles(profesionalId: number, fecha: string, duracionServicio: number): Observable<string[]> {
    const fechaObj = new Date(fecha + 'T00:00:00');
    // Ajuste de día: getDay() devuelve 0 para Domingo. 
    // Si tu base de datos usa 1=Lunes ... 7=Domingo, quizás necesites ajustar esto.
    // Asumiremos que 1=Lunes, 2=Martes... 0=Domingo.
    let diaSemana = fechaObj.getDay(); 
    if (diaSemana === 0) diaSemana = 7; // Convertimos Domingo (0) a 7 si tu BD usa ISO

    return this.getHorarioSemanal(profesionalId, diaSemana).pipe(
      switchMap(horario => {
        
        if (!horario) {
          return of([]); 
        }

        return this.getCitasEnFecha(profesionalId, fecha).pipe(
          map(citasAgendadas => {
            return this.calcularSlots(horario.horaInicio, horario.horaFin, duracionServicio, citasAgendadas);
          })
        );
      })
    );
  }

  private calcularSlots(horaInicio: string, horaFin: string, duracion: number, citas: any[]): string[] {
    const slotsDisponibles: string[] = [];
    
    // Aseguramos formato HH:mm
    const [inicioH, inicioM] = horaInicio.slice(0, 5).split(':').map(Number);
    const [finH, finM] = horaFin.slice(0, 5).split(':').map(Number);

    const fechaBase = new Date();
    fechaBase.setHours(inicioH, inicioM, 0, 0);

    const fechaFin = new Date();
    fechaFin.setHours(finH, finM, 0, 0);

    // Bucle para generar bloques de tiempo
    while (fechaBase.getTime() + (duracion * 60000) <= fechaFin.getTime()) {
      const slotInicio = fechaBase.getTime();
      const slotFin = slotInicio + (duracion * 60000);

      let hayConflicto = false;
      if (citas && citas.length > 0) {
        for (const cita of citas) {
          const citaInicio = new Date(cita.fechaHoraInicio).getTime();
          const citaFin = new Date(cita.fechaHoraFin).getTime();

          // Lógica de colisión
          if (slotInicio < citaFin && slotFin > citaInicio) {
            hayConflicto = true;
            break;
          }
        }
      }

      if (!hayConflicto) {
        const horas = fechaBase.getHours().toString().padStart(2, '0');
        const minutos = fechaBase.getMinutes().toString().padStart(2, '0');
        slotsDisponibles.push(`${horas}:${minutos}`);
      }

      fechaBase.setMinutes(fechaBase.getMinutes() + duracion);
    }

    return slotsDisponibles;
  }
}