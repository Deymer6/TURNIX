import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute, Router } from '@angular/router'; 
import { AuthService, Usuario } from '../../services/auth.service'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  negocioId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService, 
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('negocioId');
      this.negocioId = id ? +id : null; 
      console.log('Dashboard negocioId:', this.negocioId); 

      
      if (this.negocioId === null) {
        const currentUser: Usuario | null = this.authService.getCurrentUser();
        if (currentUser && currentUser.negocioIds && currentUser.negocioIds.length > 0) {
          this.negocioId = currentUser.negocioIds[0]; 
          
          this.router.navigate(['/dashboard', this.negocioId, 'servicios']);
        } else {
          console.warn('Dashboard: No negocioId found in route or current user. User might not own a business or is not logged in.');
         
        }
      }
    });
  }
}
