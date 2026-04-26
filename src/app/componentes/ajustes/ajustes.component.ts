import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { UserService } from '../../servicios/user.service';
import { User } from '../../modelos/user.model';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajustes.component.html',
  styleUrl: './ajustes.component.scss'
})
export class AjustesComponent implements OnInit {

  usuario: User | null = null;
  cargando: boolean = true;

  // Método de autenticación
  tienePassword: boolean = false;
  proveedorAuth: string = '';

  // Edición de perfil
  editandoNombre: boolean = false;
  nuevoNombre: string = '';
  
  seleccionandoFoto: boolean = false;
  fotoSeleccionada: string = '';

  // Cambio de contraseña
  mostrarCambiarPassword: boolean = false;
  passwordActual: string = '';
  passwordNueva: string = '';
  passwordConfirmar: string = '';

  // Eliminar cuenta
  mostrarEliminarCuenta: boolean = false;
  passwordEliminar: string = '';
  confirmacionEliminar: string = '';

  // Estados
  guardando: boolean = false;
  mensaje: string = '';
  error: string = '';

  // Versión de la app
  versionApp: string = '1.0.0';

  constructor(
    private auth: Auth,
    public userService: UserService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatosUsuario();
    this.verificarMetodoAuth();
  }

  async cargarDatosUsuario(): Promise<void> {
    try {
      this.cargando = true;
      const uid = this.auth.currentUser?.uid;
      
      if (!uid) {
        this.router.navigate(['/login']);
        return;
      }

      this.usuario = await this.userService.getPersonById(uid);
      
      if (this.usuario) {
        this.nuevoNombre = this.usuario.username;
        this.fotoSeleccionada = this.usuario.fotoPerfil || this.userService.fotosPerfil[0];
      }

    } catch (error) {
      console.error('Error al cargar usuario:', error);
      this.error = 'Error al cargar los datos del usuario';
    } finally {
      this.cargando = false;
    }
  }

  /**
   * Verificar qué método de autenticación usa el usuario
   */
  verificarMetodoAuth(): void {
    const user = this.auth.currentUser;
    
    if (!user) return;

    const providers = user.providerData;
    
    if (providers && providers.length > 0) {
      const providerId = providers[0].providerId;
      
      this.proveedorAuth = providerId;
      this.tienePassword = providerId === 'password';
      
      console.log('Proveedor de auth:', providerId);
      console.log('Tiene password:', this.tienePassword);
    }
  }

  /**
   * Guardar nombre de usuario
   */
  async guardarNombre(): Promise<void> {
    if (!this.nuevoNombre.trim() || !this.usuario) return;

    if (this.nuevoNombre.trim().length < 3) {
      this.error = 'El nombre debe tener al menos 3 caracteres';
      return;
    }

    try {
      this.guardando = true;
      this.error = '';
      
      await this.userService.updateUsername(this.usuario.uid, this.nuevoNombre.trim());
      
      this.usuario.username = this.nuevoNombre.trim();
      this.editandoNombre = false;
      this.mensaje = 'Nombre actualizado correctamente';
      
      setTimeout(() => this.mensaje = '', 3000);

    } catch (error: any) {
      console.error('Error al actualizar nombre:', error);
      this.error = 'Error al actualizar el nombre';
    } finally {
      this.guardando = false;
    }
  }

  cancelarEdicionNombre(): void {
    this.nuevoNombre = this.usuario?.username || '';
    this.editandoNombre = false;
    this.error = '';
  }

  /**
   * Seleccionar foto de perfil
   */
  seleccionarFoto(foto: string): void {
    this.fotoSeleccionada = foto;
  }

  async guardarFoto(): Promise<void> {
    if (!this.usuario) return;

    try {
      this.guardando = true;
      this.error = '';
      
      await this.userService.updateProfilePhoto(this.usuario.uid, this.fotoSeleccionada);
      
      this.usuario.fotoPerfil = this.fotoSeleccionada;
      this.seleccionandoFoto = false;
      this.mensaje = 'Foto de perfil actualizada';
      
      setTimeout(() => this.mensaje = '', 3000);

    } catch (error: any) {
      console.error('Error al actualizar foto:', error);
      this.error = 'Error al actualizar la foto';
    } finally {
      this.guardando = false;
    }
  }

  cancelarSeleccionFoto(): void {
    this.fotoSeleccionada = this.usuario?.fotoPerfil || this.userService.fotosPerfil[0];
    this.seleccionandoFoto = false;
    this.error = '';
  }

  /**
   * Cambiar contraseña
   */
  async cambiarPassword(): Promise<void> {
    if (!this.passwordActual || !this.passwordNueva || !this.passwordConfirmar) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    if (this.passwordNueva.length < 6) {
      this.error = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.passwordNueva !== this.passwordConfirmar) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    try {
      this.guardando = true;
      this.error = '';

      await this.userService.changePassword(this.passwordActual, this.passwordNueva);

      this.mostrarCambiarPassword = false;
      this.passwordActual = '';
      this.passwordNueva = '';
      this.passwordConfirmar = '';
      
      this.mensaje = 'Contraseña actualizada correctamente';
      setTimeout(() => this.mensaje = '', 3000);

    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        this.error = 'La contraseña actual es incorrecta';
      } else if (error.code === 'auth/weak-password') {
        this.error = 'La nueva contraseña es demasiado débil';
      } else {
        this.error = 'Error al cambiar la contraseña';
      }
    } finally {
      this.guardando = false;
    }
  }

  cancelarCambioPassword(): void {
    this.mostrarCambiarPassword = false;
    this.passwordActual = '';
    this.passwordNueva = '';
    this.passwordConfirmar = '';
    this.error = '';
  }

  /**
   * Eliminar cuenta
   */
  async eliminarCuenta(): Promise<void> {
    if (this.tienePassword && !this.passwordEliminar) {
      this.error = 'Debes ingresar tu contraseña';
      return;
    }

    if (this.confirmacionEliminar !== 'ELIMINAR') {
      this.error = 'Debes escribir "ELIMINAR" para confirmar';
      return;
    }

    try {
      this.guardando = true;
      this.error = '';

      if (this.tienePassword) {
        await this.userService.deleteMyAccount(this.passwordEliminar);
      } else {
        await this.userService.deleteMyAccountGoogle();
      }

      await signOut(this.auth);
      this.router.navigate(['/']);

    } catch (error: any) {
      console.error('Error al eliminar cuenta:', error);
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        this.error = 'Contraseña incorrecta';
      } else if (error.code === 'auth/requires-recent-login') {
        this.error = 'Por seguridad, debes volver a iniciar sesión antes de eliminar tu cuenta';
      } else {
        this.error = 'Error al eliminar la cuenta';
      }
    } finally {
      this.guardando = false;
    }
  }

  cancelarEliminarCuenta(): void {
    this.mostrarEliminarCuenta = false;
    this.passwordEliminar = '';
    this.confirmacionEliminar = '';
    this.error = '';
  }

  /**
   * Cerrar sesión
   */
  async cerrarSesion(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.error = 'Error al cerrar sesión';
    }
  }

  /**
   * Ir a página de términos y condiciones
   */
  verTerminos(): void {
    window.open('/terminos', '_blank');
  }

  /**
   * Ir a página de política de privacidad
   */
  verPrivacidad(): void {
    window.open('/privacidad', '_blank');
  }

  /**
 * Manejar error al cargar imagen
 */
onImageError(event: any): void {
  console.error('Error al cargar imagen:', event.target.src);
  // Fallback a la primera imagen disponible
  event.target.src = this.userService.fotosPerfil[0];
}
}