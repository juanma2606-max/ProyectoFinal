import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { SignInComponent } from './componentes/sign-in/sign-in.component';
import { PortadaComponent } from './componentes/portada/portada.component';
import { PlantasListaComponent } from './componentes/plantas-lista/plantas-lista.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';

export const routes: Routes = [

  // Rutas públicas (sin sidebar)
  { path: '', component: PortadaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component: SignInComponent },

  // Rutas privadas (con sidebar SIEMPRE)
  {
    path: 'app',
    component: SidebarComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'plantas', component: PlantasListaComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];
