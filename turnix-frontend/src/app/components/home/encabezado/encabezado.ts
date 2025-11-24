import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-encabezado',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encabezado.html',
  styleUrl: './encabezado.css',
})
export class EncabezadoComponent {
  
  @Input() termino: string = '';
  @Output() terminoChange = new EventEmitter<string>();
  @Output() alBuscar = new EventEmitter<void>();
  onTerminoChange(valor: string) {
    this.termino = valor;
    this.terminoChange.emit(valor); 
  }

  buscar() {
    this.alBuscar.emit();
  }
}
