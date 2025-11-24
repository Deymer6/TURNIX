import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-lista-negocios',
  standalone: true,
  imports: [],
  templateUrl: './lista-negocios.html',
  styleUrls: ['./lista-negocios.css']
})
export class ListaNegociosComponent {
  @Input() negocios: any[] = []; // Recibe los negocios FILTRADOS
  @Input() terminoBusqueda: string = '';
  @Input() categoriaActiva: string = '';

  @Output() alVerDetalle = new EventEmitter<any>();
  @Output() alLimpiar = new EventEmitter<void>();

  cargarImagenDefault(event: any) {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDIwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM2NjYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UdXJuaXg8L3RleHQ+PC9zdmc+';
  }

  verDetalle(negocio: any) {
    this.alVerDetalle.emit(negocio);
  }
}