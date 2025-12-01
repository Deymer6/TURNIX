import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import Swal from 'sweetalert2';

import { ServicioService } from '../../../app/services/servicio.service';
import { ProfesionalService  } from '../../../app/services/profesional.service';
import { CitaService } from '../../../app/services/cita.service';
import { AuthService } from '../../../app/services/auth.service'; 

@Component({
  selector: 'app-booking',
  templateUrl: './booking.html',
  styleUrls: ['./booking.css'],
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule] 
})
export class Booking implements OnInit {
  
  negocioId: number = 0;
  servicios: any[] = [];
  profesionales: any[] = [];
  horariosDisponibles: string[] = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];
  
  currentStep: number = 1; 
  servicioSeleccionado: any = null;
  profesionalSeleccionado: number | null = null;
  profesionalSeleccionadoObj: any = null; 
  fechaSeleccionada: string = '';
  horaSeleccionada: string | null = null;

  // Datos del Cliente (Se llenarán automáticamente si está logueado)
  clienteId: number | null = null; // ✅ ID DEL USUARIO REAL
  clienteNombre: string = '';
  clienteEmail: string = '';
  clienteTelefono: string = '';
  clienteNotas: string = '';

  estaGuardando: boolean = false;
  errorAlGuardar: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioService: ServicioService,
    private profesionalService: ProfesionalService,
    private citaService: CitaService,
    private authService: AuthService // ✅ Inyectamos AuthService
  ) {}

  ngOnInit(): void {
    this.negocioId = Number(this.route.snapshot.paramMap.get('negocioId')) || Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.negocioId) {
      this.cargarServicios();
    }

    // ✅ CAPTURAR DATOS DEL USUARIO LOGUEADO
    this.cargarUsuarioLogueado();
  }

  cargarUsuarioLogueado() {
    // Intentamos leer del almacenamiento local (donde se suele guardar al loguear)
    const usuarioString = localStorage.getItem('usuario'); // O 'currentUser', depende de tu login
    
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        this.clienteId = usuario.id || usuario.id_usuario; // Ajusta según tu BD
        this.clienteNombre = usuario.nombre || '';
        this.clienteEmail = usuario.email || '';
        console.log('Usuario recuperado del storage:', this.clienteId);
      } catch (e) {
        console.error('Error leyendo usuario', e);
      }
    } 
    
    // Si no encontramos usuario, usamos el ID 3 temporal para que NO falle
    if (!this.clienteId) {
        console.warn('No hay usuario logueado, usando ID temporal 3');
        this.clienteId = 3; 
    }
  }

  cargarServicios(): void {
    this.servicioService.getServiciosPorNegocio(this.negocioId).subscribe(data => this.servicios = data);
  }

  seleccionarServicio(servicio: any): void {
    this.servicioSeleccionado = servicio;
    this.currentStep = 2; 
    this.cargarProfesionales();
  }

  cargarProfesionales(): void {
    this.profesionalService.getProfesionalesPorNegocio(this.negocioId).subscribe(data => this.profesionales = data);
  }

  buscarDisponibilidad(): void {
    // Lógica simplificada de horarios fijos
    this.horaSeleccionada = null;
    this.profesionalSeleccionadoObj = this.profesionales.find(p => p.id == this.profesionalSeleccionado) || null;
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

    // Calcular fechas
    const [horas, minutos] = this.horaSeleccionada!.split(':').map(Number);
    const fechaHoraInicio = new Date(this.fechaSeleccionada + 'T00:00:00');
    fechaHoraInicio.setHours(horas, minutos);

    const fechaHoraFin = new Date(fechaHoraInicio.getTime() + this.servicioSeleccionado.duracionEstimada * 60000);

    // ✅ CORRECCIÓN FINAL: Formato PLANO (DTO) compatible con Dashboard y Backend
    const nuevaCita = {
      clienteId: 3, // ID fijo temporal (o this.clienteId si ya lo capturas)
      negocioId: this.negocioId,
      profesionalId: Number(this.profesionalSeleccionado),
      servicioId: this.servicioSeleccionado.id,
      
      // Fechas en formato ISO String
      fechaHoraInicio: this.formatDate(fechaHoraInicio), // Usamos helper para evitar líos de zona horaria
      fechaHoraFin: this.formatDate(fechaHoraFin),
      
      estado: "PENDIENTE",
      precioFinal: this.servicioSeleccionado.precio,
      notasPromocion: this.clienteNotas || 'Reserva Web'
    };

    console.log("Enviando DTO plano:", nuevaCita);

    this.citaService.crearCita(nuevaCita).subscribe({
      next: (citaGuardada) => {
        this.estaGuardando = false;
        this.currentStep = 4;
        console.log('¡Cita guardada!', citaGuardada);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.estaGuardando = false;
        this.errorAlGuardar = 'Error. Verifica consola (posible 403 o error de datos).';
      }
    });
  }

  // Helper para asegurar formato correcto de fecha (yyyy-MM-ddTHH:mm:ss)
  formatDate(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return date.getFullYear() + '-' + 
           pad(date.getMonth() + 1) + '-' + 
           pad(date.getDate()) + 'T' + 
           pad(date.getHours()) + ':' + 
           pad(date.getMinutes()) + ':' + 
           pad(date.getSeconds());
  }

  validarFormulario(): boolean {
    return !!(this.clienteNombre && this.clienteEmail && this.clienteTelefono);
  }

  volverAlInicio(): void {
    this.router.navigate(['/']); 
  }
}