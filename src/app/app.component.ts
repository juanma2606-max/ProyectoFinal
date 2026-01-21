import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { SignInComponent } from './componentes/sign-in/sign-in.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { PortadaComponent } from './componentes/portada/portada.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, SignInComponent, SidebarComponent, PortadaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Interfaz_Huerting';
}
