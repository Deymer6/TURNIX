import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { NegocioDetail } from './components/negocio-detail/negocio-detail';
import { Booking } from './components/booking/booking';
import { Dashboard } from './components/dashboard/dashboard';
import { GestionServiciosComponent } from './components/dashboard/gestion-servicios/gestion-servicios';
import { GestionCitasComponent } from './components/dashboard/gestion-citas/gestion-citas';
import { GestionPromocionesComponent } from './components/dashboard/gestion-promociones/gestion-promociones';
import { AuthGuard } from './guards/auth.guard'; 

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Register },
  { path: 'negocio/:id', component: NegocioDetail },
  { path: 'home', component: Home }, // ← Debe estar así
  { path: '', component: Home },     // ← Y esta también
  
  
  { path: 'booking/:negocioId', component: Booking, canActivate: [AuthGuard] },

  /* Rutas del Dashboard (Panel de Administración)
  {
    path: 'dashboard/:negocioId',
    component: Dashboard,
    // canActivate: [AuthGuard], // (Opcional) Deberías proteger el dashboard también
    children: [
      { path: 'servicios', component: GestionServiciosComponent },
      { path: 'citas', component: GestionCitasComponent },
      { path: 'promociones', component: GestionPromocionesComponent },
      { path: '', redirectTo: 'servicios', pathMatch: 'full' }
    ]
  }*/
];