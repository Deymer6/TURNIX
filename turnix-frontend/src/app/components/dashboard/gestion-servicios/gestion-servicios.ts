import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el formulario del modal
import { ActivatedRoute } from '@angular/router'; 
import { ServicioService } from '../../../services/servicio.service';
import Swal from 'sweetalert2'; // Importamos SweetAlert

@Component({
  selector: 'app-gestion-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-servicios.html',
  styleUrls: ['./gestion-servicios.css']
})
export class GestionServiciosComponent implements OnInit {
  servicios: any[] = [];
  negocioId: number | null = null; 
  isLoading: boolean = false;
  error: string | null = null;

  // Variables para el Modal
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;

  // Objeto del formulario
  servicioForm = {
    id: 0,
    nombreServicio: '',
    duracionEstimada: 60,
    precio: 0,
    negocioId: 0
  };

  constructor(
    private servicioService: ServicioService, // Corregí la mayúscula inicial para buenas prácticas
    private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      // Intentamos obtener 'id' (común) o 'negocioId'
      const paramId = params?.get('id') || params?.get('negocioId');
      
      if (paramId) {
        this.negocioId = +paramId; 
        this.loadServicios();
      } else {
        this.error = 'No se proporcionó un ID de negocio.';
      }
    });
  }

  loadServicios(): void {
    if (this.negocioId === null) return;

    this.isLoading = true;
    this.servicioService.getServiciosPorNegocio(this.negocioId).subscribe({
      next: (data: any) => {
        this.servicios = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar los servicios.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // --- LÓGICA DEL MODAL ---

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.servicioForm = {
      id: 0,
      nombreServicio: '',
      duracionEstimada: 30,
      precio: 0,
      negocioId: this.negocioId || 0
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(servicio: any): void {
    this.modoEdicion = true;
    this.servicioForm = {
      id: servicio.id,
      nombreServicio: servicio.nombreServicio,
      duracionEstimada: servicio.duracionEstimada,
      precio: servicio.precio,
      negocioId: this.negocioId || 0
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarServicio(): void {
    if (!this.negocioId) return;
    this.servicioForm.negocioId = this.negocioId;

    if (this.modoEdicion) {
      // EDITAR
      this.servicioService.actualizarServicio(this.servicioForm.id, this.servicioForm).subscribe({
        next: () => {
          this.cerrarModal();
          this.loadServicios();
          Swal.fire({
            title: 'Actualizado',
            text: 'Servicio modificado correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el servicio', 'error')
      });
    } else {
      // CREAR
      this.servicioService.crearServicio(this.servicioForm).subscribe({
        next: () => {
          this.cerrarModal();
          this.loadServicios();
          Swal.fire({
            title: 'Creado',
            text: 'Servicio añadido correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: () => Swal.fire('Error', 'No se pudo crear el servicio', 'error')
      });
    }
  }

  eliminarServicio(servicio: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar: ${servicio.nombreServicio}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioService.eliminarServicio(servicio.id).subscribe({
          next: () => {
            this.loadServicios();
            Swal.fire('Eliminado', 'El servicio ha sido eliminado.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }
}