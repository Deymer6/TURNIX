import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router'; 
// Asegúrate de que las rutas a tus servicios sean correctas
import { ServicioService } from '../../services/servicio.service';
import { ProfesionalService } from '../../services/profesional.service';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { CitaService } from '../../services/cita.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule] 
})
export class Booking implements OnInit {
  
  // Datos generales
  negocioId: number = 0;
  servicios: any[] = [];
  profesionales: any[] = [];
  horariosDisponibles: string[] = [];
  
  // Estado del flujo
  currentStep: number = 1; 
  
  // Reserva en progreso
  servicioSeleccionado: any = null;
  profesionalSeleccionado: number | null = null;
  profesionalSeleccionadoObj: any = null; 
  fechaSeleccionada: string = '';
  horaSeleccionada: string | null = null;

  // Datos del formulario del Paso 3
  clienteNombre: string = '';
  clienteEmail: string = '';
  clienteTelefono: string = '';
  clienteNotas: string = '';

  // Estados de carga y error
  cargandoHorarios: boolean = false;
  errorHorarios: string | null = null;
  estaGuardando: boolean = false;
  errorAlGuardar: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioService: ServicioService,
    private profesionalService: ProfesionalService,
    private disponibilidadService: DisponibilidadService,
    private citaService: CitaService
  ) {}

  ngOnInit(): void {
    // Capturamos el ID, soportando tanto 'id' como 'negocioId' por si cambia la ruta
    this.negocioId = Number(this.route.snapshot.paramMap.get('negocioId')) || Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.negocioId) {
      this.cargarServicios();
    }
  }

  cargarServicios(): void {
    this.servicioService.getServiciosPorNegocio(this.negocioId).subscribe(data => {
      this.servicios = data;
    });
  }

  seleccionarServicio(servicio: any): void {
    this.servicioSeleccionado = servicio;
    this.currentStep = 2; 
    this.cargarProfesionales();
  }

  cargarProfesionales(): void {
    this.profesionalService.getProfesionalesPorNegocio(this.negocioId).subscribe(data => {
      this.profesionales = data;
    });
  }

  buscarDisponibilidad(): void {
    this.horariosDisponibles = [];
    this.horaSeleccionada = null;
    this.errorHorarios = null;

    this.profesionalSeleccionadoObj = this.profesionales.find(p => p.id == this.profesionalSeleccionado) || null;

    if (this.profesionalSeleccionado && this.fechaSeleccionada && this.servicioSeleccionado) {
      this.cargandoHorarios = true;
      const profesionalId = Number(this.profesionalSeleccionado);
      const duracion = this.servicioSeleccionado.duracionEstimada; 

      this.disponibilidadService.getHorariosDisponibles(profesionalId, this.fechaSeleccionada, duracion)
        .subscribe({
          next: (horarios) => {
            this.horariosDisponibles = horarios;
            if (horarios.length === 0) {
              this.errorHorarios = 'No hay horarios disponibles para esta fecha.';
            }
            this.cargandoHorarios = false;
          },
          error: (err) => {
            console.error('Error al buscar disponibilidad:', err);
            this.errorHorarios = 'Error al cargar los horarios.';
            this.cargandoHorarios = false;
          }
        });
    }
  }

  seleccionarHora(hora: string): void {
    this.horaSeleccionada = hora;
  }

  continuarReserva(): void {
    this.currentStep = 3;
  }

  
  finalizarReserva(): void {
    if (!this.validarFormulario()) {
      this.errorAlGuardar = 'Por favor, complete todos los campos obligatorios.';
      return;
    }
    
    this.estaGuardando = true;
    this.errorAlGuardar = null;

    
    const [horas, minutos] = this.horaSeleccionada!.split(':').map(Number);
    const fechaHoraInicio = new Date(this.fechaSeleccionada + 'T00:00:00');
    fechaHoraInicio.setHours(horas, minutos);

    const fechaHoraFin = new Date(fechaHoraInicio.getTime() + this.servicioSeleccionado.duracionEstimada * 60000);

    
    const nuevaCita = {
      
      cliente: { id: 3 }, 
      
      negocio: { id: this.negocioId },
      
      profesional: { id: Number(this.profesionalSeleccionado) },
      
      servicio: { id: this.servicioSeleccionado.id },
      
      fechaHoraInicio: fechaHoraInicio.toISOString(),
      fechaHoraFin: fechaHoraFin.toISOString(),
      
      estado: "Pendiente",
      precioFinal: this.servicioSeleccionado.precio,
      
      // Mapeamos las notas al campo correcto de tu Backend ('notasPromocion' o similar)
      notasPromocion: this.clienteNotas 
    };

    // 3. Guardar
    this.citaService.crearCita(nuevaCita).subscribe({
      next: (citaGuardada) => {
        this.estaGuardando = false;
        this.currentStep = 4; // Éxito
        console.log('¡Cita guardada!', citaGuardada);
      },
      error: (err) => {
        console.error('Error al guardar la cita:', err);
        this.estaGuardando = false;
        this.errorAlGuardar = 'Hubo un error al confirmar tu cita. Verifica la consola.';
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.clienteNombre || !this.clienteEmail || !this.clienteTelefono) {
      return false;
    }
    return true;
  }

  volverAlInicio(): void {
    this.router.navigate(['/']); 
  }
}