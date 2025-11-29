import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isAuthenticated()) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        
        if (currentUser.rol === 'ADMIN') {
          return true;
        }

        
        if (currentUser.rol === 'USER') {
          
          if (state.url === '/crear-negocio') {
            return !currentUser.hasNegocio ? true : this.router.createUrlTree(['/dashboard', currentUser.id]);
          }

          
          if (state.url.startsWith('/dashboard')) {
            if (currentUser.hasNegocio) {
             
              if (state.url === '/dashboard' && currentUser.id) {
                return this.router.createUrlTree(['/dashboard', currentUser.id]);
              }
              return true;
            } else {
              
              return this.router.createUrlTree(['/crear-negocio']);
            }
          }
        }
        
        return true;
      }
    }
    
    return this.router.createUrlTree(['/login']);
  }
}