import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { UserService } from '../../servicios/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  sidebarOpen = false;
  esAdmin$: Observable<boolean>;
  usuario: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.esAdmin$ = this.authService.isAdmin$();
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario(): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      
      if (!user?.uid) return;

      const usuarioData = await this.userService.getPersonById(user.uid);
      
      if (usuarioData) {
  this.usuario = {
    nombre: usuarioData.username,
    email: usuarioData.email,
    foto: usuarioData.fotoPerfil // Guardar tal cual viene de Firebase
  };
  console.log('Usuario cargado:', this.usuario);
}
    } catch (error) {
  console.error('Error cargando usuario:', error);
  
  const user = this.authService.getCurrentUser();
  if (user) {
    this.usuario = {
      nombre: user.displayName || user.email?.split('@')[0] || 'Usuario',
      email: user.email || '',
      foto: 'avatar2.webp' // Usar nombre del archivo, no URL
    };
  }
}
  }

  /**
   * MÉTODO PÚBLICO llamado desde Ajustes
   */
  recargarPerfil(): void {
    console.log('🔄 Recargando perfil sidebar...');
    this.cargarDatosUsuario();
  }

  /**
 * Obtener URL completa de la foto de perfil
 */
getFotoPerfilUrl(): string {
  return this.userService.getFotoPerfilUrl(this.usuario?.foto);
}

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}