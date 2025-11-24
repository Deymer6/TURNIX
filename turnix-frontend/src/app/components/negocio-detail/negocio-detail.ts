import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NegocioService } from '../../services/negocio.service';
import { forkJoin } from 'rxjs'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-negocio-detail',
  templateUrl: './negocio-detail.html',
  styleUrls: ['./negocio-detail.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NegocioDetail implements OnInit {

  negocio: any; 
  galeria: any[] = []; 
  negocioId: number = 0; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private negocioService: NegocioService
  ) {}

  ngOnInit(): void {
    // 1. Obtiene el 'id' de la URL
    this.negocioId = Number(this.route.snapshot.paramMap.get('id'));

    // 2. Si hay un ID, cargamos los datos
    if (this.negocioId) {
      forkJoin({
        // CORRECCIÓN: Usamos los nombres que definimos en tu NegocioService
        negocio: this.negocioService.obtenerNegocioPorId(this.negocioId),
        galeria: this.negocioService.obtenerGaleriaPorNegocio(this.negocioId)
      }).subscribe({
        next: (resultado) => {
          this.negocio = resultado.negocio;
          this.galeria = resultado.galeria;
          console.log('Datos cargados:', this.negocio, this.galeria);
        },
        error: (err) => {
          console.error('Error al cargar datos del negocio', err);
        }
      });
    }
  }

  irAReservar() {
    this.router.navigate(['/booking', this.negocioId]);
  }
}