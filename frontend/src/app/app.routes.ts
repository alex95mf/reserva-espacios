import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { EspaciosLista } from './components/espacios-lista/espacios-lista';
import { MisReservas } from './components/mis-reservas/mis-reservas';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'espacios',
    pathMatch: 'full'
  },
  {
    path: 'iniciar-sesion',
    component: Login
  },
  {
    path: 'registro',
    component: Registro
  },
  {
    path: 'espacios',
    component: EspaciosLista
  },
  {
    path: 'mis-reservas',
    component: MisReservas,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'espacios'
  }
];