import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NegocioService } from '../../services/negocio.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EncabezadoComponent } from './encabezado/encabezado';
import { CategoriasComponent } from './categorias/categorias';
import { ListaNegociosComponent } from './lista-negocios/lista-negocios';
import { ComoFuncionaComponent } from './como-funciona/como-funciona';

interface NegocioVista {
  id: number;
  nombre: string;
  direccion: string;
  imagenUrl: string;
  precioMinimo: number;
  calificacion: number;
  numeroResenas: number;
  tipo: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    EncabezadoComponent,
    CategoriasComponent,
    ListaNegociosComponent,
    ComoFuncionaComponent,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  negocios: NegocioVista[] = [];
  negociosFiltrados: NegocioVista[] = [];
  categorias = ['Todos', 'Barberías', 'Salones de Uñas', 'Cercanos'];
  categoriaActiva = 'Todos';
  terminoBusqueda = '';
  cargando = false;

  @ViewChild('businessSection') businessSection!: ElementRef;

  constructor(private router: Router, private negocioService: NegocioService) {}

  ngOnInit(): void {
    this.cargarNegocios();
  }

  cargarNegocios(): void {
    this.cargando = true;
    this.negocioService.obtenerNegocios().subscribe({
      next: (data: any[]) => {
        this.negocios = data.map((item: any) => {
          
          // 1. Inferir Tipo
          let tipoInferido = 'BARBERÍA';
          const nombreLower = (item.nombreNegocio || '').toLowerCase();
          const tipoBackend = (item.tipo || '').toString();

          if (tipoBackend === 'SALON_BELLEZA' || nombreLower.includes('salón') || nombreLower.includes('uñas')) {
            tipoInferido = 'UÑAS'; 
          }

          // === 2. SOLUCIÓN DEFINITIVA DE IMÁGENES ===
          let imagenFinal = item.imagenUrl; 

          if (imagenFinal) {
             if (imagenFinal.startsWith('/images')) {
                 imagenFinal = '/assets' + imagenFinal;
             } 
             else if (imagenFinal.startsWith('images/')) {
                 imagenFinal = '/assets/' + imagenFinal;
             }
          } else {
             if (tipoInferido === 'BARBERÍA') {
                 imagenFinal = '/assets/images/barberia-fachada.jpg';
             } else {
                 imagenFinal = '/assets/images/salon-fachada.webp';
             }
          }

          return {
            id: item.id,
            nombre: item.nombreNegocio,
            direccion: item.direccion,
            imagenUrl: imagenFinal,
            precioMinimo: 18,
            calificacion: item.calificacionPromedio || 4.8,
            numeroResenas: item.numeroResenas || 10,
            tipo: tipoInferido,
          };
        });
        this.negociosFiltrados = [...this.negocios];
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al cargar negocios', err);
        this.cargando = false;
      },
    });
  }

  // Función de navegación
  irADetalle(negocio: any): void {
    this.router.navigate(['/negocio-detail', negocio.id]);
  }

  // ... Funciones de filtrado y búsqueda ...
  filtrarPorCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
    this.filtrarNegocios();
  }

  filtrarNegocios(): void {
    let resultados = this.negocios;
    if (this.categoriaActiva !== 'Todos') {
      const esBarberia = this.categoriaActiva === 'Barberías';
      const esSalon = this.categoriaActiva === 'Salones de Uñas';
      if (esBarberia) resultados = resultados.filter((n) => n.tipo === 'BARBERÍA');
      else if (esSalon) resultados = resultados.filter((n) => n.tipo === 'UÑAS' || n.tipo === 'SALÓN');
    }
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      resultados = resultados.filter(
        (negocio) =>
          negocio.nombre.toLowerCase().includes(termino) || 
          negocio.tipo.toLowerCase().includes(termino) 
      );
    }
    this.negociosFiltrados = resultados;
  }

  buscarNegocios(): void { this.filtrarNegocios(); this.desplazarAResultados(); }
  desplazarAResultados(): void { setTimeout(() => { if (this.businessSection) { const y = this.businessSection.nativeElement.getBoundingClientRect().top + window.pageYOffset - 100; window.scrollTo({ top: y, behavior: 'smooth' }); } }, 100); }
  limpiarBusqueda(): void { this.terminoBusqueda = ''; this.categoriaActiva = 'Todos'; this.negociosFiltrados = [...this.negocios]; window.scrollTo({ top: 0, behavior: 'smooth' }); }
}