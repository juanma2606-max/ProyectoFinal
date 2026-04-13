import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../servicios/user.service';
import { UserCredential } from '@angular/fire/auth';
import { matchPasswordValidator } from '../../Validations/signin.validator';
import { restrictedWordsValidator } from '../../Validations/login.validator';
import { User } from '../../modelos/user.model';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  registerForm: FormGroup;
  error: string | null = null;

  constructor(
    formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.registerForm = formBuilder.group({
      'username': ['', [
        Validators.required,
        Validators.minLength(5),
        restrictedWordsValidator(['admin', 'superadmin'])
      ]],
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      'confirmPassword': ['', [
        Validators.required,
        matchPasswordValidator
      ]]
    });
  }

  async onSubmit() {
    console.log(this.registerForm);
    console.log(this.registerForm.errors);
    console.log(this.registerForm.status);

    // Comprobamos que el formulario sea válido
    if (this.registerForm.valid) {
      const username = this.registerForm.get("username")?.value;
      const email = this.registerForm.get("email")?.value;
      const password = this.registerForm.get("password")?.value;

      try {
        // Registrar en Firebase Authentication
        const userCredential: UserCredential = await this.authService.register(email, password);

        // Crear perfil de usuario en Realtime Database
        const newUser = new User(
          userCredential.user.uid,
          username,
          email
        );
        
        await this.userService.createPerson(newUser);

        // Redirigir a la app
        this.error = null;
        this.router.navigate(['/app']);

      } catch (error: any) {
        console.error(error);
        
        if (error.code === 'auth/email-already-in-use') {
          this.error = "El correo ya está en uso";
        } else if (error.code === 'auth/weak-password') {
          this.error = "La contraseña es demasiado débil";
        } else if (error.code === 'auth/invalid-email') {
          this.error = "El correo no es válido";
        } else {
          this.error = "Error al crear la cuenta. Inténtalo de nuevo.";
        }
      }
    } else {
      this.error = "Por favor, completa todos los campos correctamente";
    }
  }
}