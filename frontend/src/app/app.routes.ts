import { Routes } from '@angular/router';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistroComponent } from './components/registro/registro.component';
import { EspaciosListaComponent } from './components/espacios-lista/espacios-lista.component';
import { MisReservasComponent } from './components/mis-reservas/mis-reservas.component';
import { AbmEspaciosComponent } from './components/abm-espacios/abm-espacios.component';
import { EspacioDetalleComponent } from './components/espacio-detalle/espacio-detalle.component';
import { CalendarioEspaciosComponent } from './components/calendario-espacios/calendario-espacios.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'espacios', pathMatch: 'full' },
  { path: 'iniciar-sesion', component: IniciarSesionComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'espacios', component: EspaciosListaComponent },
  { path: 'espacios/detalle/:id', component: EspacioDetalleComponent },
  { path: 'espacios/calendario/:id', component: CalendarioEspaciosComponent },
  { path: 'mis-reservas', component: MisReservasComponent, canActivate: [authGuard] },
  { path: 'administracion/espacios', component: AbmEspaciosComponent, canActivate: [authGuard] }
];