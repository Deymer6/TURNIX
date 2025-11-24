import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

import { CitaService } from '../../../services/cita.service';

import { ServicioService } from '../../../services/servicio.service';
@Component({
  selector: 'app-gestion-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-servicios.html',
  styleUrls: ['./gestion-servicios.css']
})
export class GestionServiciosComponent implements OnInit {
  servicios: any[] = [];
  negocioId: number | null = null; // Declare negocioId property
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private ServicioService: ServicioService,
    private citaService: CitaService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const negocioIdParam = params?.get('negocioId');
      if (negocioIdParam) {
        this.negocioId = +negocioIdParam; // Convert string to number
        this.loadServicios();
      } else {
        this.error = 'No se proporcionó un ID de negocio.';
        console.error('No se proporcionó un ID de negocio en la ruta.');
      }
    });
  }

  loadServicios(): void {
    if (this.negocioId === null) {
      this.error = 'No se puede cargar servicios sin un ID de negocio.';
      return;
    }

    this.isLoading = true;
    this.error = null; // Clear previous errors

    this.ServicioService.getServiciosPorNegocio(this.negocioId).subscribe(
      (data: any) => {
        this.servicios = data;
        this.isLoading = false;
        console.log('Servicios cargados:', this.servicios);
      },
      (error: any) => {
        this.error = 'Error al cargar los servicios. Por favor, inténtelo de nuevo más tarde.';
        this.isLoading = false;
        console.error('Error al cargar los servicios:', error);
      }
    );
  }
}
