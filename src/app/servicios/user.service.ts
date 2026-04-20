import { Injectable } from '@angular/core';
import { Database, get, listVal, ref, remove, update } from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { Auth, User as FirebaseUser } from '@angular/fire/auth';
import { User } from '../modelos/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private database: Database, private auth: Auth) { }

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
        u.profile.fecha_registro
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
        data.fecha_registro
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
      fecha_registro: person.fecha_registro
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
      fecha_registro: person.fecha_registro
    };

    return update(profileRef, profileData);
  }

  /**
   * Obtener usuario autenticado actualmente
   */
  getUserAuth(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  /**
   * ADMIN: Banear usuario (lo marca como baneado, no puede volver a logearse)
   */
  async banUser(id: string): Promise<void> {
    const bannedRef = ref(this.database, `banned_users/${id}`);
    return update(bannedRef, {
      banned_at: new Date().toISOString(),
      reason: 'Baneado por administrador'
    });
  }

  /**
   * ADMIN: Eliminar usuario (banea + elimina sus datos)
   */
  async removePerson(id: string): Promise<void> {
    // Primero baneamos
    await this.banUser(id);
    
    // Luego eliminamos sus datos
    const userRef = ref(this.database, `users/${id}`);
    return remove(userRef);
  }

  /**
   * USUARIO: Eliminar su propia cuenta (solo borra datos, puede volver a registrarse)
   */
  async deleteMyAccount(uid: string): Promise<void> {
    const userRef = ref(this.database, `users/${uid}`);
    return remove(userRef);
  }

  /**
   * Verificar si un usuario está baneado
   */
  async isUserBanned(uid: string): Promise<boolean> {
    const bannedRef = ref(this.database, `banned_users/${uid}`);
    const snapshot = await get(bannedRef);
    return snapshot.exists();
  }
}