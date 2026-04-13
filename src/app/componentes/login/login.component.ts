import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { UserCredential } from '@angular/fire/auth';
import { UserService } from '../../servicios/user.service';
import { User } from '../../modelos/user.model';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  formLogin = {
    email: '',
    password: ''
  };

  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async onSubmit() {
    if (!this.formLogin.email || !this.formLogin.password) {
      this.error = "Completa todos los campos";
      return;
    }

    try {
      const userCredential: UserCredential = await this.authService.login(
        this.formLogin.email, 
        this.formLogin.password
      );

      // Verificar si el usuario está baneado
      const isBanned = await this.userService.isUserBanned(userCredential.user.uid);
      
      if (isBanned) {
        this.error = "Tu cuenta ha sido suspendida. Contacta con el administrador.";
        await this.authService.logout();
        return;
      }

      // Login exitoso
      this.error = null;
      this.router.navigate(['/app']);
    } catch (err) {
      console.error(err);
      this.error = "Credenciales incorrectas";
    }
  }

  async loginWithGoogle() {
    try {
      const credential = await this.authService.loginWithGoogle();
      const user = credential.user;

      // Verificar si está baneado
      const isBanned = await this.userService.isUserBanned(user.uid);
      
      if (isBanned) {
        this.error = "Tu cuenta ha sido suspendida. Contacta con el administrador.";
        await this.authService.logout();
        return;
      }

      // Comprobamos si ya existe en Firebase
      const userExistente = await this.userService.getPersonById(user.uid);

      if (!userExistente) {
        // Primera vez que entra con Google → lo guardamos
        const newUser = new User(
          user.uid,
          user.displayName || user.email || 'Usuario',
          user.email || ''
        );
        await this.userService.createPerson(newUser);
      }

      this.router.navigate(['/app']);
    } catch (err: any) {
      console.error(err);
      
      // Error específico de dominio no autorizado
      if (err.code === 'auth/unauthorized-domain') {
        this.error = "Dominio no autorizado. Configura Firebase para este dominio.";
      } else {
        this.error = "Error al iniciar con Google";
      }
    }
  }
}
