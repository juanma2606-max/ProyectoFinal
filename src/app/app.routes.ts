import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { PortadaComponent } from './componentes/portada/portada.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { SignInComponent } from './componentes/sign-in/sign-in.component';
import { HuertoFormComponent } from './componentes/huerto-form/huerto-form.component';
import { HuertoComponent } from './componentes/huerto/huerto.component';
import { CultivoFormComponent } from './componentes/cultivo-form/cultivo-form.component';
import { PlantasComponent } from './componentes/planta/planta.component';
import { PlantaDetalleComponent } from './componentes/planta/planta-detalles/planta-detalles.component';
import { AmenazasComponent } from './componentes/amenazas/amenazas.component';
import { AmenazaDetalleComponent } from './componentes/amenazas/amenazas-detalles/amenazas-detalles.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { AmenazaformComponent } from './componentes/amenazas/amenazas-form/amenazas-form.component';
import { ChatIaComponent } from './componentes/chat-ia/chat-ia.component';
import { AjustesComponent } from './componentes/ajustes/ajustes.component';
import { AccesoDenegadoComponent } from './componentes/acceso-denegado/acceso-denegado.component';  // ← AGREGAR IMPORT
import { PlantasFormComponent } from './componentes/planta/planta-form/planta-form.component';

export const routes: Routes = [

  // ==========================================
  // RUTAS PÚBLICAS
  // ==========================================
  { path: '', component: PortadaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'acceso-denegado', component: AccesoDenegadoComponent },  // ← AGREGAR RUTA

  // ==========================================
  // RUTAS PRIVADAS CON SIDEBAR
  // ==========================================
  {
    path: 'app',
    component: SidebarComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      
      // ------------------------------------------
      // HOME
      // ------------------------------------------
      { path: 'home', component: HomeComponent },

      // ------------------------------------------
      // HUERTOS
      // ------------------------------------------
      { path: 'huerto/:id', component: HuertoComponent },
      { path: 'huertoform', component: HuertoFormComponent },
      { path: 'huertoform/:id', component: HuertoFormComponent },

      // ------------------------------------------
      // CULTIVOS
      // ------------------------------------------
      { path: 'cultivoform/:huertoId', component: CultivoFormComponent },
      { path: 'cultivoform/:huertoId/:cultivoId', component: CultivoFormComponent },

      // ------------------------------------------
      // PLANTAS
      // ------------------------------------------
      {
        path: 'plantas',
        component: PlantasComponent,
        children: [
          { path: ':id', component: PlantaDetalleComponent }
        ]
      },
      { path: 'plantasform', component: PlantasFormComponent },
      { path: 'plantasform/:id', component: PlantasFormComponent },

      // ------------------------------------------
      // AMENAZAS
      // ------------------------------------------
      {
        path: 'amenazas',
        component: AmenazasComponent,
        children: [
          { path: ':id', component: AmenazaDetalleComponent }
        ]
      },
      { path: 'amenazasform', component: AmenazaformComponent },
      { path: 'amenazasform/:id', component: AmenazaformComponent },

      // ------------------------------------------
      // ADMIN (protegido con adminGuard)
      // ------------------------------------------
      { 
        path: 'admin', 
        component: AdminComponent, 
        canActivate: [adminGuard] 
      },
      { 
        path: 'admin/usuario/:uid', 
        component: AdminComponent, 
        canActivate: [adminGuard] 
      },
      { 
        path: 'admin/usuario/:uid/huerto/:huertoId', 
        component: HuertoComponent, 
        canActivate: [adminGuard] 
      },
      { 
        path: 'admin/usuario/:uid/huertoform/:id', 
        component: HuertoFormComponent, 
        canActivate: [adminGuard] 
      },

      // ------------------------------------------
      // OTROS
      // ------------------------------------------
      { path: 'ajustes', component: AjustesComponent },
      { path: 'chat-ia', component: ChatIaComponent },
    ]
  },

  // ==========================================
  // RUTA WILDCARD (404)
  // ==========================================
  { path: '**', redirectTo: '' }
];