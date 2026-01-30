import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { SignInComponent } from './componentes/sign-in/sign-in.component';
import { PortadaComponent } from './componentes/portada/portada.component';
import { PlantasListaComponent } from './componentes/plantas-lista/plantas-lista.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { AjustesComponent } from './componentes/ajustes/ajustes.component';
import { PlagasListaComponent } from './componentes/plagas-lista/plagas-lista.component';
import { HuertoComponent } from './componentes/huerto/huerto.component';
import { PlantasComponent } from './componentes/plantas/plantas.component';
import { PlagasComponent } from './componentes/plaga-item/plaga-item.component';
import { MacetaComponent } from './componentes/maceta/maceta.component';

export const routes: Routes = [

  // Rutas públicas (sin sidebar)
  { path: '', component: PortadaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'ajustes', component: AjustesComponent },

  // Rutas privadas (con sidebar SIEMPRE)
  {
  path: 'app',
  component: SidebarComponent,
  children: [
    { path: 'home', component: HomeComponent },
    { path: 'plantas', component: PlantasComponent },
    { path: 'plagas', component: PlagasComponent },
    { path: 'huerto', component: HuertoComponent },
    { path: 'maceta', component: MacetaComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
  ]
}
];
