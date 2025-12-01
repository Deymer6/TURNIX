import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ProfesionalService } from '../../../../app/services/profesional.service';

@Component({
  selector: 'app-gestion-profesionales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-profesionales.html',
  styleUrl: './gestion-profesionales.css'
})
export class GestionProfesionales implements OnInit {

  // Variables que el HTML necesita
  negocioId: number = 0;
  profesionales: any[] = [];
  cargando: boolean = false;
  mostrarFormulario: boolean = false;
  esEdicion: boolean = false;
  
  // Modelo para el formulario
  profesionalActual: any = {
    id: null,
    nombre: '',
    apellido: '',
    especialidad: '',
    activo: true,
    negocio: { id: 0 }
  };

  constructor(
    private route: ActivatedRoute,
    private profesionalService: ProfesionalService
  ) {}

  ngOnInit(): void {
    // Obtenemos el ID del negocio de la ruta (actual o padre)
    this.negocioId = Number(this.route.snapshot.paramMap.get('negocioId')) || 
                     Number(this.route.parent?.snapshot.paramMap.get('negocioId'));

    if (this.negocioId) {
      this.cargarProfesionales();
    }
  }

  cargarProfesionales() {
    this.cargando = true;
    this.profesionalService.getProfesionalesPorNegocio(this.negocioId).subscribe({
      next: (data) => {
        this.profesionales = data;
        this.cargando = false;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar los profesionales', 'error');
        this.cargando = false;
      }
    });
  }

  // Funciones llamadas desde el HTML
  
  abrirFormularioCrear() {
    this.esEdicion = false;
    this.mostrarFormulario = true;
    // Reseteamos el formulario
    this.profesionalActual = {
      id: null,
      nombre: '',
      apellido: '',
      especialidad: '',
      activo: true,
      negocio: { id: this.negocioId }
    };
  }

  abrirFormularioEditar(profesional: any) {
    this.esEdicion = true;
    this.mostrarFormulario = true;
    // Copiamos los datos para editar
    this.profesionalActual = { ...profesional };
    
    // Aseguramos que tenga el objeto negocio para que el backend no falle
    if (!this.profesionalActual.negocio) {
        this.profesionalActual.negocio = { id: this.negocioId };
    }
  }

  cancelarEdicion() {
    this.mostrarFormulario = false;
  }

  guardarProfesional() {
    if (!this.profesionalActual.nombre || !this.profesionalActual.apellido) {
      Swal.fire('Atención', 'Por favor completa el nombre y apellido', 'warning');
      return;
    }

    this.cargando = true;

    if (this.esEdicion) {
      
      this.profesionalService.actualizarProfesional(this.profesionalActual.id, this.profesionalActual).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Actualizado!',
            text: 'Profesional actualizado correctamente',
            icon: 'success',
            confirmButtonColor: '#1a1a1a' 
          });
          this.cerrarYRecargar();
        },
        error: (err) => {
          console.error(err);
          this.cargando = false;
          alert('Error al actualizar');
        }
      });
    } else {
      // Crear
      this.profesionalService.crearProfesional(this.profesionalActual).subscribe({
        next: () => {
          Swal.fire('Error', 'Hubo un problema al actualizar', 'error');
          this.cerrarYRecargar();
        },
        error: (err) => {
          console.error(err);
          this.cargando = false;
          Swal.fire('Error', 'Hubo un problema al crear', 'error');
        }
      });
    }
  }

  eliminarProfesional(id: number) {
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.profesionalService.eliminarProfesional(id).subscribe({
          next: () => {
            this.profesionales = this.profesionales.filter(p => p.id !== id);
            Swal.fire('¡Eliminado!', 'El profesional ha sido eliminado.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }

  private cerrarYRecargar() {
    this.mostrarFormulario = false;
    this.cargarProfesionales();
  }
}