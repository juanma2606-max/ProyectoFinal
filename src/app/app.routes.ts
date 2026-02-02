import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { SignInComponent } from './componentes/sign-in/sign-in.component';
import { PortadaComponent } from './componentes/portada/portada.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { AjustesComponent } from './componentes/ajustes/ajustes.component';
import { HuertoComponent } from './componentes/huerto/huerto.component';
import { MacetaComponent } from './componentes/maceta/maceta.component';
import { PlagasComponent } from './componentes/plagas/plagas.component';
import { PlagaDetalleComponent } from './componentes/plaga-detalle/plaga-detalle.component';
import { PlantaDetalleComponent } from './componentes/planta-detalle/planta-detalle.component';
import { PlantasComponent } from './componentes/planta/planta.component';

export const routes: Routes = [

  // Rutas públicas
  { path: '', component: PortadaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'ajustes', component: AjustesComponent },

  // Rutas privadas con sidebar
  {
    path: 'app',
    component: SidebarComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
    path: 'plantas',
    component: PlantasComponent,
    children: [
      { path: ':id', component: PlantaDetalleComponent }
    ]
},
      {
        path: 'plagas',
        component: PlagasComponent,
        children: [
          { path: ':id', component: PlagaDetalleComponent }
        ]
      },

      { path: 'huerto', component: HuertoComponent },
      { path: 'maceta', component: MacetaComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
