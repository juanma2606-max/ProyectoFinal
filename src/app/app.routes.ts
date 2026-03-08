import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { SignInComponent } from './componentes/sign-in/sign-in.component';
import { PortadaComponent } from './componentes/portada/portada.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { AjustesComponent } from './componentes/ajustes/ajustes.component';
import { HuertoComponent } from './componentes/huerto/huerto.component';
import { MacetaComponent } from './componentes/maceta/maceta.component';
import { PlantaDetalleComponent } from './componentes/planta-detalle/planta-detalle.component';
import { PlantasComponent } from './componentes/planta/planta.component';
import { AmenazasComponent } from './componentes/amenaza/amenaza.component';
import { AmenazaDetalleComponent } from './componentes/amenaza-detalle/amenaza-detalle.component';
import { AmenazaformComponent } from './componentes/amenazas-form/amenazas-form.component';
import { PlantasFormComponent } from './componentes/plantas-form/plantas-form.component';

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
        path: 'amenazas',
        component: AmenazasComponent,
        children: [
          { path: ':id', component: AmenazaDetalleComponent }
        ]
      },
      { path: 'amenazaform', component: AmenazaformComponent },// CREAR
      { path: 'amenazaform/:id', component: AmenazaformComponent }, // EDITAR
      { path: 'plantasform',      component: PlantasFormComponent },   // CREAR
      { path: 'plantasform/:id',  component: PlantasFormComponent },   // EDITAR
      { path: 'huerto', component: HuertoComponent },
      { path: 'maceta', component: MacetaComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
