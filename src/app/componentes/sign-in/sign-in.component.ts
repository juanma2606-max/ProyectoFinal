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
  cargando: boolean = false;

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
      this.cargando = true;
      this.error = null;

      const username = this.registerForm.get("username")?.value;
      const email = this.registerForm.get("email")?.value;
      const password = this.registerForm.get("password")?.value;

      try {
        // 1. VALIDACIÓN: Verificar si el email ya existe en la Database
        const emailYaRegistrado = await this.userService.isEmailRegistered(email);
        
        if (emailYaRegistrado) {
          this.error = "⚠️ Este correo ya está registrado. Intenta iniciar sesión o usa otro correo.";
          this.cargando = false;
          return;
        }

        // 2. Registrar en Firebase Authentication
        const userCredential: UserCredential = await this.authService.register(email, password);
        const uid = userCredential.user.uid;

        // 3. VALIDACIÓN: Verificar si el usuario está baneado
        const banStatus = await this.userService.isUserBanned(uid);
        
        if (banStatus.banned) {
          // Si está baneado, eliminar la cuenta recién creada
          await this.authService.logout();
          
          this.error = `🚫 Esta cuenta ha sido baneada. Motivo: ${banStatus.reason || 'Violación de términos de uso'}`;
          this.cargando = false;
          return;
        }

        // 4. Crear perfil de usuario en Realtime Database
        const newUser = new User(
          uid,
          username,
          email,
          new Date().toISOString(),
          this.userService.fotosPerfil[0], // Foto por defecto
          false // No baneado
        );
        
        await this.userService.createPerson(newUser);

        // 5. Redirigir a la app
        this.error = null;
        this.cargando = false;
        this.router.navigate(['/app']);

      } catch (error: any) {
        console.error('Error en registro:', error);
        this.cargando = false;
        
        if (error.code === 'auth/email-already-in-use') {
          this.error = "⚠️ El correo ya está en uso en Firebase Authentication";
        } else if (error.code === 'auth/weak-password') {
          this.error = "🔒 La contraseña es demasiado débil (mínimo 6 caracteres)";
        } else if (error.code === 'auth/invalid-email') {
          this.error = "📧 El correo no es válido";
        } else {
          this.error = "❌ Error al crear la cuenta. Inténtalo de nuevo.";
        }
      }
    } else {
      this.error = "📝 Por favor, completa todos los campos correctamente";
    }
  }
}