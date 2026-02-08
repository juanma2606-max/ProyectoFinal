import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { UserCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  formLogin = {
    email: '',
    password: ''
  };

  error: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (!this.formLogin.email || !this.formLogin.password) {
      this.error = "Completa todos los campos";
      return;
    }

    this.authService.login(this.formLogin.email, this.formLogin.password)
      .then((user: UserCredential) => {
        this.error = null;
        this.router.navigate(['/app']);
      })
      .catch((err) => {
        console.error(err);
        this.error = "Credenciales incorrectas";
      });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(() => {
        this.router.navigate(['/app']);
      })
      .catch((err) => {
        console.error(err);
        this.error = "Error al iniciar con Google";
      });
  }
}
