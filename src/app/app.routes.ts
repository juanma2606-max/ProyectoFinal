import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { PortadaComponent } from './componentes/portada/portada.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { SignInComponent } from './componentes/sign-in/sign-in.component';
// import { AjustesComponent } from './componentes/ajustes/ajustes.component'; // ← NO ACTUALIZADO
 import { PlantasComponent } from './componentes/planta/planta.component'; // ← NO ACTUALIZADO
// import { AmenazasComponent } from './componentes/amenaza/amenaza.component'; // ← NO ACTUALIZADO
// import { AmenazaDetalleComponent } from './componentes/amenaza-detalle/amenaza-detalle.component'; // ← NO ACTUALIZADO
// import { AmenazaformComponent } from './componentes/amenazas-form/amenazas-form.component'; // ← NO ACTUALIZADO
// import { PlantasFormComponent } from './componentes/plantas-form/plantas-form.component'; // ← NO ACTUALIZADO
import { HuertoFormComponent } from './componentes/huerto-form/huerto-form.component'; // ← NO ACTUALIZADO
import { HuertoComponent } from './componentes/huerto/huerto.component';
import { CultivoFormComponent } from './componentes/cultivo-form/cultivo-form.component'; // ← NO ACTUALIZADO
import { PlantaDetalleComponent } from './componentes/planta/planta-detalles/planta-detalles.component';
// import { adminGuard } from './guards/admin.guard'; // ← NO ACTUALIZADO
// import { AdminPanelComponent } from './componentes/admin-panel/admin-panel.component'; // ← NO ACTUALIZADO
// import { AdminUsuarioComponent } from './componentes/admin-usuario/admin-usuario.component'; // ← NO ACTUALIZADO
// import { ChatIaComponent } from './componentes/chat-ia/chat-ia.component'; // ← NO ACTUALIZADO

export const routes: Routes = [

  // ==========================================
  // RUTAS PÚBLICAS - ACTUALIZADAS
  // ==========================================
  { path: '', component: PortadaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signIn', component: SignInComponent },
  // { path: 'ajustes', component: AjustesComponent }, // ← NO ACTUALIZADO

  // ==========================================
  // RUTAS PRIVADAS CON SIDEBAR
  // ==========================================
  {
    path: 'app',
    component: SidebarComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent }, // ✅ ACTUALIZADO

      // ------------------------------------------
      // HUERTOS - NO ACTUALIZADOS AÚN
      // ------------------------------------------
      { path: 'huerto/:id', component: HuertoComponent },
      { path: 'huertoform', component: HuertoFormComponent },
      { path: 'huertoform/:id', component: HuertoFormComponent },

      // ------------------------------------------
      // ❌ CULTIVOS - NO ACTUALIZADOS AÚN
      // ------------------------------------------
      { path: 'cultivoform/:huertoId', component: CultivoFormComponent },
      { path: 'cultivoform/:huertoId/:cultivoId', component: CultivoFormComponent },

      // ------------------------------------------
      // ❌ PLANTAS - NO ACTUALIZADAS AÚN
      // ------------------------------------------
      {
         path: 'plantas',
        component: PlantasComponent,
         children: [
           { path: ':id', component: PlantaDetalleComponent }
         ]
       },
       //{ path: 'plantasform', component: PlantasFormComponent },
       //{ path: 'plantasform/:id', component: PlantasFormComponent },

      // ------------------------------------------
      // ❌ AMENAZAS - NO ACTUALIZADAS AÚN
      // ------------------------------------------
      // {
      //   path: 'amenazas',
      //   component: AmenazasComponent,
      //   children: [
      //     { path: ':id', component: AmenazaDetalleComponent }
      //   ]
      // },
      // { path: 'amenazaform', component: AmenazaformComponent },
      // { path: 'amenazaform/:id', component: AmenazaformComponent },

      // ------------------------------------------
      // ❌ ADMIN - NO ACTUALIZADAS AÚN
      // ------------------------------------------
      // { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },
      // { path: 'admin/usuario/:uid', component: AdminUsuarioComponent, canActivate: [adminGuard] },
      // { path: 'admin/usuario/:uid/huerto/:huertoId', component: HuertoComponent, canActivate: [adminGuard] },
      // { path: 'admin/usuario/:uid/huertoform/:id', component: HuertoFormComponent, canActivate: [adminGuard] },
      // { path: 'admin/usuario/:uid/cultivoform/:huertoId', component: CultivoFormComponent, canActivate: [adminGuard] },
      // { path: 'admin/usuario/:uid/cultivoform/:huertoId/:cultivoId', component: CultivoFormComponent, canActivate: [adminGuard] },

      // ------------------------------------------
      // ❌ OTROS - NO ACTUALIZADOS AÚN
      // ------------------------------------------
      // { path: 'ajustes', component: AjustesComponent },
      // { path: 'chat-ia', component: ChatIaComponent },
    ]
  }
];