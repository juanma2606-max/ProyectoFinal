import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { signOut } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent{

  
  sidebarOpen = false;
  esAdmin = false;

  constructor(private auth: Auth, private router: Router, private authService: AuthService) {
    authState(this.auth).subscribe(user => {
      this.esAdmin = user?.email === 'admin@huerting.com';
    });
  }


  cerrarSesion(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }
}