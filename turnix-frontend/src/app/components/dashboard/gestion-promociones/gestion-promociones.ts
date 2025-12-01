import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PromocionService } from '../../../services/promocion.Service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-promociones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-promociones.html',
  styleUrls: ['./gestion-promociones.css']
})
export class GestionPromocionesComponent implements OnInit {
  promociones: any[] = [];
  negocioId: number | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  mostrarModal: boolean = false;
  modoEdicion: boolean = false;

  promoForm = {
    id: 0,
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    activa: true,
    negocio: { id: 0 }
  };

  constructor(
    private promocionService: PromocionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params?.get('id') || params?.get('negocioId');
      if (id) {
        this.negocioId = +id;
        this.loadPromociones();
      } else {
        this.error = 'No se proporcionó un ID de negocio.';
      }
    });
  }

  loadPromociones(): void {
    if (this.negocioId === null) return;
    this.isLoading = true;

    this.promocionService.getPromocionesPorNegocio(this.negocioId).subscribe({
      next: (data) => {
        this.promociones = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las promociones.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.promoForm = {
      id: 0,
      titulo: '',
      descripcion: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: '',
      activa: true,
      negocio: { id: this.negocioId || 0 }
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(promo: any): void {
    this.modoEdicion = true;
    this.promoForm = {
      id: promo.id,
      titulo: promo.titulo,
      descripcion: promo.descripcion,
      fechaInicio: promo.fechaInicio,
      fechaFin: promo.fechaFin,
      activa: promo.activa,
      negocio: { id: this.negocioId || 0 }
    };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarPromocion(): void {
    if (!this.negocioId) return;
    this.promoForm.negocio.id = this.negocioId;

    if (this.modoEdicion) {
      this.promocionService.actualizarPromocion(this.promoForm.id, this.promoForm).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Promoción editada correctamente', 'success');
          this.cerrarModal();
          this.loadPromociones();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
      });
    } else {
      this.promocionService.crearPromocion(this.promoForm).subscribe({
        next: () => {
          Swal.fire('Creado', 'Promoción creada correctamente', 'success');
          this.cerrarModal();
          this.loadPromociones();
        },
        error: () => Swal.fire('Error', 'No se pudo crear', 'error')
      });
    }
  }

  eliminarPromocion(promo: any): void {
    Swal.fire({
      title: '¿Eliminar promoción?',
      text: `Se borrará: ${promo.titulo}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.promocionService.eliminarPromocion(promo.id).subscribe({
          next: () => {
            Swal.fire('Eliminado', '', 'success');
            this.loadPromociones();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }
}