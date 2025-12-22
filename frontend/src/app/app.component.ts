import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraNavegacionComponent } from './components/barra-navegacion/barra-navegacion.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BarraNavegacionComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}