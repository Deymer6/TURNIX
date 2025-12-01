import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { CitaService } from '../../../services/cita.service';
import { ProfesionalService } from '../../../services/profesional.service';
import { ServicioService } from '../../../services/servicio.service';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-citas.html',
  styleUrls: ['./gestion-citas.css']
})
export class GestionCitasComponent implements OnInit {

  citas: any[] = [];
  staffList: any[] = [];
  serviciosList: any[] = [];
  negocioId: number | null = null;
  
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;

  // CORRECCIÓN 1: Inicializamos con null, NO con comillas vacías ''
  citaForm: any = {
    id: null,
    clienteId: 1, 
    profesionalId: null, // <--- Cambio importante
    servicioId: null,    // <--- Cambio importante
    fecha: '',
    hora: '',
    estado: 'PROGRAMADA',
    precioFinal: 0,
    notasPromocion: ''
  };

  constructor(
    private citaService: CitaService,
    private profesionalService: ProfesionalService,
    private servicioService: ServicioService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params?.get('id') || params?.get('negocioId');
      if (id) {
        this.negocioId = +id;
        this.cargarDatosIniciales();
      }
    });
  }

  cargarDatosIniciales(): void {
    if (!this.negocioId) return;
    this.loadCitas();

    this.profesionalService.getProfesionalesByNegocioId(this.negocioId).subscribe({
      next: (data) => this.staffList = data,
      error: (err) => console.error('Error cargando staff', err)
    });

    this.servicioService.getServiciosByNegocioId(this.negocioId).subscribe({
      next: (data) => this.serviciosList = data,
      error: (err) => console.error('Error cargando servicios', err)
    });
  }

  loadCitas(): void {
    if (this.negocioId) {
      this.citaService.getCitasPorNegocio(this.negocioId).subscribe({
        next: (data) => this.citas = data,
        error: (err) => console.error(err)
      });
    }
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.citaForm = {
      id: null,
      clienteId: 1, 
      profesionalId: null, // null al abrir
      servicioId: null,    // null al abrir
      fecha: new Date().toISOString().split('T')[0],
      hora: '09:00',
      estado: 'PROGRAMADA',
      precioFinal: 0,
      notasPromocion: ''
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(cita: any): void {
    this.modoEdicion = true;
    const fechaObj = new Date(cita.fechaHoraInicio);
    
    this.citaForm = {
      id: cita.id,
      clienteId: cita.cliente?.id || 1,
      // Aseguramos que tomamos el ID numérico
      profesionalId: cita.profesional?.id,
      servicioId: cita.servicio?.id,
      fecha: fechaObj.toISOString().split('T')[0],
      hora: fechaObj.toTimeString().substring(0, 5),
      estado: cita.estado,
      precioFinal: cita.precioFinal,
      notasPromocion: cita.notasPromocion
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarCita(): void {
    if (!this.negocioId) return;

    // CORRECCIÓN 2: Validación antes de enviar
    if (!this.citaForm.profesionalId || !this.citaForm.servicioId) {
        Swal.fire('Atención', 'Debes seleccionar un Profesional y un Servicio', 'warning');
        return;
    }

    const fechaInicio = `${this.citaForm.fecha}T${this.citaForm.hora}:00`;
    const fechaObj = new Date(this.citaForm.fecha + 'T' + this.citaForm.hora);
    fechaObj.setHours(fechaObj.getHours() + 1);
    
    // Formateo simple de fecha fin
    const fechaFin = fechaObj.toISOString().slice(0, 19); 

    const dto = {
      clienteId: this.citaForm.clienteId,
      negocioId: this.negocioId,
      profesionalId: +this.citaForm.profesionalId, // El '+' fuerza la conversión a número
      servicioId: +this.citaForm.servicioId,       // El '+' fuerza la conversión a número
      fechaHoraInicio: fechaInicio,
      fechaHoraFin: fechaFin,
      estado: this.citaForm.estado,
      precioFinal: this.citaForm.precioFinal,
      notasPromocion: this.citaForm.notasPromocion
    };

    if (this.modoEdicion) {
      this.citaService.actualizarCita(this.citaForm.id, dto).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Cita actualizada', 'success');
          this.cerrarModal();
          this.loadCitas();
        },
        error: (e) => Swal.fire('Error', 'No se pudo actualizar', 'error')
      });
    } else {
      this.citaService.crearCita(dto).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Cita creada', 'success');
          this.cerrarModal();
          this.loadCitas();
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear la cita', 'error');
        }
      });
    }
  }

  eliminarCita(cita: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.citaService.eliminarCita(cita.id).subscribe({
          next: () => {
            Swal.fire('Borrado', 'La cita ha sido eliminada.', 'success');
            this.loadCitas();
          }
        });
      }
    })
  }
}