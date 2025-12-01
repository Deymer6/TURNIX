import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NegocioService } from '../../services/negocio.service';
import { CommonModule } from '@angular/common'; 
import { catchError, forkJoin, of } from 'rxjs'; 

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
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private negocioService: NegocioService
  ) {}

  ngOnInit(): void {
    this.negocioId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.negocioId) {
      forkJoin({
        negocio: this.negocioService.obtenerNegocioPorId(this.negocioId),
        galeria: this.negocioService.obtenerGaleriaPorNegocio(this.negocioId).pipe(
            catchError(error => {
                return of([]); 
            })
        )
      }).subscribe({
        next: (resultado) => {
          this.negocio = resultado.negocio;
          this.galeria = resultado.galeria;
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
        }
      });
    }
  }

  irAReservar() {
    this.router.navigate(['/booking', this.negocioId]);
  }
}