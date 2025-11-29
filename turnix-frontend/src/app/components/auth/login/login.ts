import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Asegúrate que la ruta al servicio sea correcta
import { AuthService } from "./../../../services/auth.service"; 

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Importante para que funcione ngModel y ngIf
})
export class Login {
  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.error = "Por favor completa todos los campos";
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        // Siempre redirigir al home después del login
        this.router.navigate(['/']); 
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Credenciales incorrectas o error en el servidor';
      }
    });
  }

  navigateToRegistro() {
    this.router.navigate(['/registro']);
  }
}