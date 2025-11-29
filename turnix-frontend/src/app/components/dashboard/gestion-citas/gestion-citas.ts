import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CitaService } from '../../../services/cita.service';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './gestion-citas.html',
  styleUrls: ['./gestion-citas.css']
})
export class GestionCitasComponent implements OnInit {
  citas: any[] = []; 
  negocioId: number | null = null; // Add negocioId property
  error: string | null = null;

  constructor(
    private citaService: CitaService,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const negocioIdParam = params?.get('negocioId');
      if (negocioIdParam) {
        this.negocioId = +negocioIdParam; // Convert string to number
        this.loadCitas();
      } else {
        this.error = 'No se proporcionó un ID de negocio.';
        console.error('No se proporcionó un ID de negocio en la ruta.');
      }
    });
  }

  loadCitas(): void {
    if (this.negocioId === null) {
      this.error = 'No se puede cargar citas sin un ID de negocio.';
      return;
    }

    this.citaService.getCitasPorNegocio(this.negocioId).subscribe(
      (data: any) => {
        this.citas = data;
        console.log('Citas cargadas:', this.citas);
      },
      (error: any) => {
        this.error = 'Error al cargar las citas. Por favor, inténtelo de nuevo más tarde.';
        console.error('Error al cargar las citas:', error);
      }
    );
  }
}
