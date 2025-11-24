import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate que esta línea exista
import { CitaService } from '../../../services/cita.service';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule], // Y que CommonModule esté aquí
  templateUrl: './gestion-citas.html',
  styleUrls: ['./gestion-citas.css']
})
export class GestionCitasComponent implements OnInit {
  citas: any[] = []; 

  constructor(
    private citaService: CitaService
  ) { }

  ngOnInit(): void {
    this.citaService.getCitasPorUsuario(1).subscribe(
      (data: any) => {
        this.citas = data;
        console.log('Citas cargadas:', this.citas);
      },
      (error: any) => {
        console.error('Error al cargar las citas:', error);
      }
    );
  }
}
