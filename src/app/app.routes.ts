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
import { HuertoFormComponent } from './componentes/huerto-form/huerto-form.component';
import { CultivoFormComponent } from './componentes/cultivo-form/cultivo-form.component';
import { adminGuard } from './guards/admin.guard';
import { AdminPanelComponent } from './componentes/admin-panel/admin-panel.component';
import { AdminUsuarioComponent } from './componentes/admin-usuario/admin-usuario.component';

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
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },

      // Huertos
      { path: 'huerto/:id', component: HuertoComponent },
      { path: 'maceta/:id', component: MacetaComponent },
      { path: 'huertoform', component: HuertoFormComponent },
      { path: 'huertoform/:id', component: HuertoFormComponent },

      // Cultivos
      { path: 'cultivoform/:huertoId', component: CultivoFormComponent },
      { path: 'cultivoform/:huertoId/:cultivoId', component: CultivoFormComponent },

      // Plantas
      {
        path: 'plantas',
        component: PlantasComponent,
        children: [
          { path: ':id', component: PlantaDetalleComponent }
        ]
      },
      { path: 'plantasform', component: PlantasFormComponent },
      { path: 'plantasform/:id', component: PlantasFormComponent },

      // Amenazas
      {
        path: 'amenazas',
        component: AmenazasComponent,
        children: [
          { path: ':id', component: AmenazaDetalleComponent }
        ]
      },
      { path: 'amenazaform', component: AmenazaformComponent },
      { path: 'amenazaform/:id', component: AmenazaformComponent },

      // Admin
      { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },
      { path: 'admin/usuario/:uid', component: AdminUsuarioComponent, canActivate: [adminGuard] },
      { path: 'admin/usuario/:uid/huerto/:huertoId', component: HuertoComponent, canActivate: [adminGuard] },
      { path: 'admin/usuario/:uid/huertoform/:id', component: HuertoFormComponent, canActivate: [adminGuard] },
      { path: 'admin/usuario/:uid/cultivoform/:huertoId', component: CultivoFormComponent, canActivate: [adminGuard] },
{ path: 'admin/usuario/:uid/cultivoform/:huertoId/:cultivoId', component: CultivoFormComponent, canActivate: [adminGuard] },


      // Ajustes
      { path: 'ajustes', component: AjustesComponent },
    ]
  }
];