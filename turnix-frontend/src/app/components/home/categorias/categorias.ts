import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categorias.html',
  styleUrls: ['./categorias.css']
})
export class CategoriasComponent {
  @Input() categorias: string[] = [];
  @Input() categoriaActiva: string = 'Todos';
  @Input() mostrarBotonLimpiar: boolean = false;

  @Output() alFiltrar = new EventEmitter<string>();
  @Output() alLimpiar = new EventEmitter<void>();

  filtrar(cat: string) {
    this.alFiltrar.emit(cat);
  }

  limpiar() {
    this.alLimpiar.emit();
  }
}