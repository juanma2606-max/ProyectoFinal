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
  cargando: boolean = false;
  cargandoGoogle: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async onSubmit() {
    if (!this.formLogin.email || !this.formLogin.password) {
      this.error = "📝 Completa todos los campos";
      return;
    }

    this.cargando = true;
    this.error = null;

    try {
      // 1. Intentar login en Firebase Authentication
      const userCredential: UserCredential = await this.authService.login(
        this.formLogin.email, 
        this.formLogin.password
      );

      const uid = userCredential.user.uid;

      // 2. VALIDACIÓN: Verificar si el usuario está baneado
      const banStatus = await this.userService.isUserBanned(uid);
      
      if (banStatus.banned) {
        await this.authService.logout();
        
        this.error = `🚫 Tu cuenta ha sido suspendida. Motivo: ${banStatus.reason || 'Violación de términos de uso'}. Contacta con el administrador.`;
        this.cargando = false;
        return;
      }

      // 3. Login exitoso
      this.error = null;
      this.cargando = false;
      this.router.navigate(['/app']);

    } catch (err: any) {
      console.error('Error en login:', err);
      this.cargando = false;

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        this.error = "❌ Credenciales incorrectas";
      } else if (err.code === 'auth/too-many-requests') {
        this.error = "⏱️ Demasiados intentos. Intenta de nuevo más tarde.";
      } else if (err.code === 'auth/user-disabled') {
        this.error = "🚫 Esta cuenta ha sido deshabilitada";
      } else {
        this.error = "❌ Error al iniciar sesión. Inténtalo de nuevo.";
      }
    }
  }

  async loginWithGoogle() {
    this.cargandoGoogle = true;
    this.error = null;

    try {
      // 1. Login con Google
      const credential = await this.authService.loginWithGoogle();
      const user = credential.user;
      const uid = user.uid;

      // 2. VALIDACIÓN: Verificar si está baneado
      const banStatus = await this.userService.isUserBanned(uid);
      
      if (banStatus.banned) {
        await this.authService.logout();
        
        this.error = `🚫 Tu cuenta ha sido suspendida. Motivo: ${banStatus.reason || 'Violación de términos de uso'}. Contacta con el administrador.`;
        this.cargandoGoogle = false;
        return;
      }

      // 3. Verificar si ya existe en Firebase Database
      const userExistente = await this.userService.getPersonById(uid);

      if (!userExistente) {
        // Primera vez con Google → crear perfil
        const newUser = new User(
          uid,
          user.displayName || user.email?.split('@')[0] || 'Usuario',
          user.email || '',
          new Date().toISOString(),
          user.photoURL || this.userService.fotosPerfil[0], // Usar foto de Google si existe
          false // No baneado
        );
        await this.userService.createPerson(newUser);
      }

      // 4. Login exitoso
      this.cargandoGoogle = false;
      this.router.navigate(['/app']);

    } catch (err: any) {
      console.error('Error en login con Google:', err);
      this.cargandoGoogle = false;
      
      if (err.code === 'auth/popup-closed-by-user') {
        this.error = "❌ Inicio de sesión cancelado";
      } else if (err.code === 'auth/unauthorized-domain') {
        this.error = "⚠️ Dominio no autorizado. Configura Firebase para este dominio.";
      } else if (err.code === 'auth/popup-blocked') {
        this.error = "🚫 Popup bloqueado. Permite popups para este sitio.";
      } else {
        this.error = "❌ Error al iniciar con Google";
      }
    }
  }
}