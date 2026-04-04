import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  isCollapsed = false;
  sidebarOpen = false;

  constructor(private auth: Auth, private router: Router) {}


  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion(): void {
  signOut(this.auth).then(() => {
    this.router.navigate(['/login']);
  });

}}
