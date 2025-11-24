import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './como-funciona.html',
  styleUrls: ['./como-funciona.css']
})
export class ComoFuncionaComponent {
  @Input() visible: boolean = true;
}