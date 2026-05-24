import { Injectable } from '@angular/core';
import { Database, get, listVal, ref, remove, update } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { Auth, User as FirebaseUser, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from '@angular/fire/auth';
import { User } from '../modelos/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Fotos de perfil disponibles
  fotosPerfil: string[] = [
    'avatar1.webp',
    'avatar2.webp',
    'avatar3.webp',
    'avatar4.webp',
    'avatar5.webp',
    'avatar6.webp'
  ];

  constructor(private database: Database, private auth: Auth) { }

/**
 * Construir URL completa para foto de perfil
 */
getFotoPerfilUrl(nombreFoto: string | undefined): string {
  // Si no hay foto o es la vieja 'perfil.png', usar default
  if (!nombreFoto || nombreFoto === 'perfil.png' || nombreFoto.trim() === '') {
    return '/images/avatars/avatar2.webp';
  }
  
  // Si ya tiene el path completo, devolverlo
  if (nombreFoto.startsWith('/images') || nombreFoto.startsWith('images')) {
    return nombreFoto.startsWith('/') ? nombreFoto : `/${nombreFoto}`;
  }
  
  // Si solo es el nombre del archivo, construir el path
  return `/images/avatars/${nombreFoto}`;
}

/**
 * Limpiar nombre de foto (solo el nombre del archivo)
 */
private limpiarNombreFoto(foto: string): string {
  if (!foto) return 'avatar2.webp';
  
  // Si tiene path, extraer solo el nombre
  if (foto.includes('/')) {
    const partes = foto.split('/');
    return partes[partes.length - 1];
  }
  
  return foto;
}

  /**
   * Obtener todos los usuarios (para admin)
   */
  getAllPersons(): Observable<User[]> {
    const usersRef = ref(this.database, 'users');
    
    return listVal(usersRef, { keyField: 'uid' }).pipe(
      map((usersData: any[]) => 
        usersData.map(u => new User(
          u.uid,
          u.profile.username,
          u.profile.email,
          u.profile.fecha_registro,
          u.profile.fotoPerfil,
          u.profile.baneado,
          u.profile.motivoBaneo
        ))
      )
    );
  }

  /**
   * Obtener perfil de un usuario por ID
   */
  async getPersonById(id: string): Promise<User | null> {
    const profileRef = ref(this.database, `users/${id}/profile`);
    const snapshot = await get(profileRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return new User(
        id,
        data.username,
        data.email,
        data.fecha_registro,
        data.fotoPerfil,
        data.baneado,
        data.motivoBaneo
      );
    }
    return null;
  }

  /**
   * Crear perfil de usuario (al registrarse)
   */
  async createPerson(person: User): Promise<void> {
    const profileRef = ref(this.database, `users/${person.uid}/profile`);
    
   const profileData = {
  username: person.username,
  email: person.email,
  fecha_registro: person.fecha_registro,
  fotoPerfil: this.limpiarNombreFoto(person.fotoPerfil || this.fotosPerfil[0]),
  baneado: false
};

    return update(profileRef, profileData);
  }

  /**
   * Actualizar perfil de usuario
   */
  updatePersonFirebase(person: User): Promise<void> {
    const profileRef = ref(this.database, `users/${person.uid}/profile`);
    
    const profileData = {
      username: person.username,
      email: person.email,
      fecha_registro: person.fecha_registro,
      fotoPerfil: person.fotoPerfil,
      baneado: person.baneado,
      motivoBaneo: person.motivoBaneo
    };

    return update(profileRef, profileData);
  }

  /**
   * Actualizar solo el nombre de usuario
   */
  async updateUsername(uid: string, newUsername: string): Promise<void> {
    const profileRef = ref(this.database, `users/${uid}/profile`);
    return update(profileRef, { username: newUsername });
  }

/**
 * Actualizar solo la foto de perfil
 */
async updateProfilePhoto(uid: string, photoUrl: string): Promise<void> {
  // Limpiar el nombre de la foto (solo guardar el nombre del archivo)
  const nombreFotoLimpio = this.limpiarNombreFoto(photoUrl);
  
  const profileRef = ref(this.database, `users/${uid}/profile`);
  return update(profileRef, { fotoPerfil: nombreFotoLimpio });
}

  /**
   * Obtener usuario autenticado actualmente
   */
  getUserAuth(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  /**
   * Cambiar contraseña (requiere reautenticación)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No hay usuario autenticado');
    }

    // Reautenticar antes de cambiar la contraseña
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Cambiar la contraseña
    await updatePassword(user, newPassword);
  }

  /**
   * USUARIO: Eliminar su propia cuenta (con password)
   * Solo elimina de Authentication, mantiene datos en Database para poder volver a registrarse
   */
  async deleteMyAccount(password: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No hay usuario autenticado');
    }

    // Reautenticar antes de eliminar
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Solo eliminar de Authentication, NO de Database
    await deleteUser(user);
  }

  /**
   * USUARIO: Eliminar cuenta con Google (sin password)
   */
  async deleteMyAccountGoogle(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    // Para usuarios de Google, no necesitamos reautenticación con password
    await deleteUser(user);
  }

  /**
   * ADMIN: Banear usuario (marca como baneado en Database)
   */
  async banUser(id: string, motivo: string = 'Violación de términos de uso'): Promise<void> {
    const profileRef = ref(this.database, `users/${id}/profile`);
    return update(profileRef, {
      baneado: true,
      motivoBaneo: motivo,
      fecha_baneo: new Date().toISOString()
    });
  }

  /**
   * ADMIN: Desbanear usuario
   */
  async unbanUser(id: string): Promise<void> {
    const profileRef = ref(this.database, `users/${id}/profile`);
    return update(profileRef, {
      baneado: false,
      motivoBaneo: null,
      fecha_baneo: null
    });
  }

  /**
   * ADMIN: Eliminar usuario (banea permanentemente + elimina datos)
   */
  async removePerson(id: string): Promise<void> {
    // Primero banear permanentemente
    await this.banUser(id, 'Cuenta eliminada por administrador');
    
    // Luego eliminar todos sus datos
    const userRef = ref(this.database, `users/${id}`);
    return remove(userRef);
  }

  /**
   * Verificar si un usuario está baneado
   */
  async isUserBanned(uid: string): Promise<{ banned: boolean; reason?: string }> {
    const profileRef = ref(this.database, `users/${uid}/profile`);
    const snapshot = await get(profileRef);

    if (!snapshot.exists()) {
      return { banned: false };
    }

    const data = snapshot.val();
    return {
      banned: data.baneado || false,
      reason: data.motivoBaneo
    };
  }

  /**
   * Verificar si un email ya está registrado en Database
   */
  async isEmailRegistered(email: string): Promise<boolean> {
    const usersRef = ref(this.database, 'users');
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) return false;

    const users = snapshot.val();
    for (const uid in users) {
      if (users[uid].profile?.email === email) {
        return true;
      }
    }

    return false;
  }
}