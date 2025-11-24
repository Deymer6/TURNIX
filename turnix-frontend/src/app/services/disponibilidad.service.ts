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
    
    return this.http.get<any[]>(`${this.apiUrl}/disponibilidades?profesionalId=${profesionalId}&diaSemana=${diaSemana}`)
      .pipe(
        map(resp => (resp && resp.length > 0) ? resp[0] : null)
      );
  }
  private getCitasEnFecha(profesionalId: number, fecha: string): Observable<any[]> {
    
    return this.http.get<any[]>(`${this.apiUrl}/citas?profesionalId=${profesionalId}&fecha=${fecha}`);
  }
  getHorariosDisponibles(profesionalId: number, fecha: string, duracionServicio: number): Observable<string[]> {
    const fechaObj = new Date(fecha + 'T00:00:00');
    const diaSemana = fechaObj.getDay(); 

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
    const [inicioH, inicioM] = horaInicio.split(':').map(Number);
    const [finH, finM] = horaFin.split(':').map(Number);

    const fechaBase = new Date();
    fechaBase.setHours(inicioH, inicioM, 0, 0);

    const fechaFin = new Date();
    fechaFin.setHours(finH, finM, 0, 0);

    while (fechaBase.getTime() + (duracion * 60000) <= fechaFin.getTime()) {
      const slotInicio = fechaBase.getTime();
      const slotFin = slotInicio + (duracion * 60000);

      
      let hayConflicto = false;
      if (citas && citas.length > 0) {
        for (const cita of citas) {
          
          const citaInicio = new Date(cita.fechaHoraInicio).getTime();
          const citaFin = new Date(cita.fechaHoraFin).getTime();

          
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