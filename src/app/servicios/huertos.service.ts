import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Database, get, listVal, push, ref, remove, update } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { Huerto } from '../modelos/huerto.model';

@Injectable({
  providedIn: 'root'
})
export class HuertosService {
  authService: any;

  constructor(private database: Database, private auth: Auth) { }

  getUserAuth(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Obtener todos los huertos del usuario autenticado
   */
  getAllHuertosFirebase(): Observable<Huerto[]> {
    const user = this.getUserAuth();
    // Si no hay usuario autenticado, devolvemos un array vacío
    if (!user) {
      return of([]);
    }

    const uid = user.uid;
    const huertosRef = ref(this.database, `users/${uid}/huertos`);
    return listVal(huertosRef, { keyField: 'id' }) as Observable<Huerto[]>;
  }

  /**
   * Obtener huertos de un usuario específico (para admin)
   */
  getHuertosByUid(uid: string): Observable<Huerto[]> {
    const huertosRef = ref(this.database, `users/${uid}/huertos`);
    return listVal(huertosRef, { keyField: 'id' }) as Observable<Huerto[]>;
  }

  /**
   * Obtener un huerto específico por ID (del usuario autenticado)
   */
  async getHuertoById(huertoId: string): Promise<Huerto | null> {
    const user = this.getUserAuth();
    if (!user) {
      return null;
    }

    const huertoRef = ref(this.database, `users/${user.uid}/huertos/${huertoId}`);
    const data = await get(huertoRef);

    if (!data.exists()) return null;

    const raw = data.val();

    return new Huerto(
      raw.nombre,
      raw.descripcion,
      raw.ubicacion,
      raw.superficie,
      raw.tipo_suelo,
      raw.horas_sol,
      raw.tiene_riego,
      raw.fecha_creacion,
      data.key!,
      raw.notas
    );
  }

  /**
   * Crear un nuevo huerto
   */
  createHuerto(huerto: Huerto) {
    const user = this.getUserAuth();
    if (!user) {
      return Promise.reject(new Error('Usuario no autenticado'));
    }

    const huertoRef = ref(this.database, `users/${user.uid}/huertos`);

    const datatosave = {
      nombre: huerto.nombre,
      descripcion: huerto.descripcion,
      ubicacion: huerto.ubicacion,
      superficie: huerto.superficie,
      tipo_suelo: huerto.tipo_suelo,
      horas_sol: huerto.horas_sol,
      tiene_riego: huerto.tiene_riego,
      fecha_creacion: huerto.fecha_creacion,
      notas: huerto.notas || ''
    };

    return push(huertoRef, datatosave);
  }

  /**
   * Actualizar un huerto (del usuario autenticado)
   */
  updateObject(huerto: Huerto) {
    const user = this.getUserAuth();
    if (!user) {
      return Promise.reject(new Error('Error al modificar el huerto'));
    }

    const uid = user.uid;

    // Ruta correcta: users/${uid}/huertos/${huerto.id}
    const objectRef = ref(this.database, `users/${uid}/huertos/${huerto.id}`);

    // Limpiamos el objeto: le quitamos el ID para no guardarlo en Firebase
    const { id, ...dataToSave } = huerto;
    return update(objectRef, dataToSave);
  }

  /**
   * Eliminar un huerto (y todos sus cultivos)
   */
  removeObject(huertoId: string): Promise<void> {
    const user = this.getUserAuth();
    if (!user) {
      return Promise.reject(new Error('Error al eliminar el huerto'));
    }
    const uid = user.uid;

    const objectRef = ref(this.database, `users/${uid}/huertos/${huertoId}`);

    return remove(objectRef);
  }

  /**
   * Obtener un huerto de un usuario específico (para admin)
   */
  async getHuertoByUidAndId(uid: string, huertoId: string): Promise<Huerto | null> {
    const huertoRef = ref(this.database, `users/${uid}/huertos/${huertoId}`);
    const data = await get(huertoRef);
    
    if (!data.exists()) return null;
    
    const raw = data.val();
    
    return new Huerto(
      raw.nombre,
      raw.descripcion,
      raw.ubicacion,
      raw.superficie,
      raw.tipo_suelo,
      raw.horas_sol,
      raw.tiene_riego,
      raw.fecha_creacion,
      data.key!,
      raw.notas
    );
  }

  /**
   * Actualizar huerto de un usuario específico (para admin)
   */
  updateObjectByUid(uid: string, huerto: Huerto) {
    const objectRef = ref(this.database, `users/${uid}/huertos/${huerto.id}`);
    const { id, ...dataToSave } = huerto;
    return update(objectRef, dataToSave);
  }
}