import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NegocioService, CrearNegocioDTO } from '../../services/negocio.service';
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
    // Optional: Check if user already owns a business and redirect
    this.authService.currentUser$.subscribe(user => {
      if (user && user.hasNegocio) {
        this.router.navigate(['/dashboard', user.id]); // Assuming user.id can be used as negocioId for now
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.negocioForm.valid) {
      const formValue: CrearNegocioDTO = this.negocioForm.value;
      this.negocioService.crearNegocio(formValue).subscribe({
        next: (response) => {
          this.successMessage = 'Negocio creado exitosamente!';
          // Update current user's hasNegocio status in AuthService
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            this.authService.updateUserHasNegocioStatus(true);
          }
          this.router.navigate(['/dashboard', response.id]); // Navigate to the new business's dashboard
        },
        error: (err) => {
          console.error('Error al crear negocio:', err);
          console.log('Full error object:', err);
          console.log('err.error object:', err.error);

          if (err.error && typeof err.error === 'object') {
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
