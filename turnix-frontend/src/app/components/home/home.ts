
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NegocioService } from '../../services/negocio.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// Importamos los HIJOS
import { EncabezadoComponent } from './encabezado/encabezado';
import { CategoriasComponent } from './categorias/categorias';
import { ListaNegociosComponent } from './lista-negocios/lista-negocios';
import { ComoFuncionaComponent } from './como-funciona/como-funciona';
import { PiePaginaComponent } from './pie-pagina/pie-pagina';

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
    PiePaginaComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'] 
})
export class Home implements OnInit {
  
  negocios: NegocioVista[] = [];
  negociosFiltrados: NegocioVista[] = [];
  categorias = ['Todos', 'Barberías', 'Salones de Uñas', 'Cercanos'];
  categoriaActiva = 'Todos';
  terminoBusqueda = '';
  cargando = false;

  @ViewChild('businessSection') businessSection!: ElementRef;

  constructor(
    private router: Router,
    private negocioService: NegocioService
  ) {}

  ngOnInit(): void {
    this.cargarNegocios();
  }

  
  cargarNegocios(): void {
    this.cargando = true;
    this.negocioService.obtenerNegocios().subscribe({
      next: (data: any[]) => {
        this.negocios = data.map((item: any) => {
          let tipoInferido = 'BARBERÍA';
          const nombreLower = (item.nombreNegocio || '').toLowerCase();
          if (nombreLower.includes('salón') || nombreLower.includes('salon') || nombreLower.includes('uñas')) {
            tipoInferido = 'UÑAS';
          }
          return {
            id: item.id,
            nombre: item.nombreNegocio,
            direccion: item.direccion,
            imagenUrl: this.getImagenDefault(tipoInferido),
            precioMinimo: 25,
            calificacion: 4.8,
            numeroResenas: 10,
            tipo: tipoInferido
          };
        });
        this.negociosFiltrados = [...this.negocios];
        this.cargando = false;
      },
      error: (err) => { console.error(err); this.cargando = false; }
    });
  }

  getImagenDefault(tipo: string): string {
     
    const imagenes: { [key: string]: string } = {
      'BARBERÍA': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=500&q=80',
      'UÑAS': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=500&q=80',
      'SALÓN': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=80'
    };
    return imagenes[tipo] || imagenes['BARBERÍA'];
  }

  
  buscarNegocios(): void {
    this.filtrarNegocios();
    this.desplazarAResultados();
    
  }
  desplazarAResultados(): void {
   
    setTimeout(() => {
      
      if (this.businessSection) {
        const element = this.businessSection.nativeElement;
        
        
        const yOffset = -100; 
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
  
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  }
  

  filtrarPorCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
    this.filtrarNegocios();
  }

  filtrarNegocios(): void {
    let resultados = this.negocios;

    if (this.categoriaActiva !== 'Todos') {
        const esBarberia = this.categoriaActiva === 'Barberías';
        const esSalon = this.categoriaActiva === 'Salones de Uñas';
        if (esBarberia) resultados = resultados.filter(n => n.tipo === 'BARBERÍA');
        else if (esSalon) resultados = resultados.filter(n => n.tipo === 'UÑAS');
    }

    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      resultados = resultados.filter(negocio =>
        negocio.nombre.toLowerCase().includes(termino)
      );
    }
    this.negociosFiltrados = resultados;
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.categoriaActiva = 'Todos';
    this.negociosFiltrados = [...this.negocios];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  irADetalle(negocio: any): void {
    this.router.navigate(['/negocio', negocio.id]);
  }
}