import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  sidebarOpen = false;
  esAdmin$: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // 🦴 Asignar Observable en constructor (contexto inyección)
    this.esAdmin$ = this.authService.isAdmin$();
    console.log('🦴 Sidebar constructor, esAdmin$ asignado');
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}