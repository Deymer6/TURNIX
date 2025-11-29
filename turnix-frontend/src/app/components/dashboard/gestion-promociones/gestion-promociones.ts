import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocionService } from '../../../services/promocion.Service';
import { ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-gestion-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-promociones.html',
  styleUrls: ['./gestion-promociones.css']
})
export class GestionPromocionesComponent implements OnInit {
  promociones: any[] = [];
  negocioId: number | null = null; 
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private PromocionService: PromocionService,
    private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const negocioIdParam = params?.get('negocioId');
      if (negocioIdParam) {
        this.negocioId = +negocioIdParam; 
        this.loadPromociones();
      } else {
        this.error = 'No se proporcionó un ID de negocio.';
        console.error('No se proporcionó un ID de negocio en la ruta para promociones.');
      }
    });
  }

  loadPromociones(): void {
    if (this.negocioId === null) {
      this.error = 'No se pueden cargar promociones sin un ID de negocio.';
      return;
    }

    this.isLoading = true;
    this.error = null; 

    this.PromocionService.getPromocionesPorNegocio(this.negocioId).subscribe(
      (data: any[]) => {
        this.promociones = data;
        this.isLoading = false;
        console.log('Promociones cargadas:', this.promociones);
      },
      (error: any) => {
        this.error = 'Error al cargar las promociones. Por favor, inténtelo de nuevo más tarde.';
        this.isLoading = false;
        console.error('Error al cargar las promociones:', error);
      }
    );
  }
}