import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// Importamos Negocio también para usarlo en el tipo de respuesta
import { NegocioService, CrearNegocioDTO, Negocio } from '../../services/negocio.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-crear-negocio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-negocio.html',
  styleUrl: './crear-negocio.css'
})
export class CrearNegocioComponent implements OnInit {
  negocioForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private negocioService: NegocioService,
    private authService: AuthService,
    private router: Router
  ) {
    this.negocioForm = this.fb.group({
      nombreNegocio: ['', Validators.required],
      direccion: ['', Validators.required],
      telefonoNegocio: [''],
      descripcion: [''],
      horarioApertura: ['', Validators.required],
      horarioCierre: ['', Validators.required],
      ciudad: ['', Validators.required],
      tipo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.hasNegocio) {
        // user.id puede ser usado si la lógica de tu dashboard lo requiere
        this.router.navigate(['/dashboard', user.id]); 
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.negocioForm.valid) {
      const formValue: CrearNegocioDTO = this.negocioForm.value;
      
      this.negocioService.crearNegocio(formValue).subscribe({
        // CORRECCIÓN: Tipado explícito para 'response'
        next: (response: Negocio) => {
          this.successMessage = 'Negocio creado exitosamente!';
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            this.authService.updateUserHasNegocioStatus(true);
          }
          this.router.navigate(['/dashboard', response.id]);
        },
        // CORRECCIÓN: Tipado explícito para 'err'
        error: (err: any) => {
          console.error('Error al crear negocio:', err);
          
          if (err.error && typeof err.error === 'object') {
            // Manejo seguro de errores en caso de que sea un objeto de validación
            const errorMessages = Object.values(err.error).join('; ');
            this.errorMessage = `Error de validación: ${errorMessages}`;
          } else {
            this.errorMessage = err.error?.message || 'Error al crear el negocio. Inténtalo de nuevo.';
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos y válidos.';
    }
  }
}