import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocionService } from '../../../services/promocion.Service';
import { ServicioService } from '../../../services/servicio.service';

@Component({
  selector: 'app-gestion-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-promociones.html',
  styleUrls: ['./gestion-promociones.css']
})
export class GestionPromocionesComponent implements OnInit {
  promociones: any[] = [];

  constructor(private ServicioService: ServicioService
    , private PromocionService: PromocionService
  ) { }

  ngOnInit(): void {
    this.PromocionService.getPromocionesPorNegocio(1).subscribe(
      (data: any[]) => {
        this.promociones = data;
        console.log('Promociones cargadas:', this.promociones);
      },
      (error: any) => {
        console.error('Error al cargar las promociones:', error);
      }
    );
  }
}