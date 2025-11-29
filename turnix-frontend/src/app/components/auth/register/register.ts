import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Register {
  
  
  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  };

  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar() {
   
    if (this.usuario.password !== this.usuario.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (this.usuario.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.loading = true;
    this.error = '';

   
    const datosRegistro = {
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      email: this.usuario.email,
      telefono: this.usuario.telefono,
      password: this.usuario.password,
    };

   
    this.authService.registro(datosRegistro).subscribe({
      next: (response) => {
        this.loading = false;
        
        alert('¡Cuenta creada exitosamente! Por favor inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        
        
        this.error = typeof err.error === 'string' ? err.error : 'Error al registrar usuario. Intente nuevamente.';
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}