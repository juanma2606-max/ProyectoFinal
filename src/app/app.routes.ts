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

// ❌ PENDIENTES (comentados hasta actualizar):
// import { AjustesComponent } from './componentes/ajustes/ajustes.component';
// import { PlantasFormComponent } from './componentes/plantas-form/plantas-form.component';
// import { AdminUsuarioComponent } from './componentes/admin-usuario/admin-usuario.component';
// import { ChatIaComponent } from './componentes/chat-ia/chat-ia.component';

export const routes: Routes = [

  // ==========================================
  // RUTAS PÚBLICAS
  // ==========================================
  { path: '', component: PortadaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component: SignInComponent },

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
      // ❌ PENDIENTE: descomentar cuando esté listo
      // { path: 'plantasform', component: PlantasFormComponent },
      // { path: 'plantasform/:id', component: PlantasFormComponent },

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
      // ❌ PENDIENTE: descomentar cuando admin-usuario esté actualizado
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
      // { 
      //   path: 'admin/usuario/:uid/cultivoform/:huertoId', 
      //   component: CultivoFormComponent, 
      //   canActivate: [adminGuard] 
      // },
      // { 
      //   path: 'admin/usuario/:uid/cultivoform/:huertoId/:cultivoId', 
      //   component: CultivoFormComponent, 
      //   canActivate: [adminGuard] 
      // },

      // ------------------------------------------
      // OTROS (pendientes)
      // ------------------------------------------
      // { path: 'ajustes', component: AjustesComponent },
      // { path: 'chat-ia', component: ChatIaComponent },
    ]
  },

  // ==========================================
  // RUTA WILDCARD (404)
  // ==========================================
  { path: '**', redirectTo: '' }
];