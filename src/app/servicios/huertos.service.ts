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

/**
 * Construir URL completa para foto de huerto
 */
getFotoHuertoUrl(nombreFoto: string | undefined): string {
  // Si no hay foto, usar default
  if (!nombreFoto || nombreFoto.trim() === '') {
    return '/images/huerto1.jpg';
  }
  
  // Si ya tiene el path completo, devolverlo
  if (nombreFoto.startsWith('/images') || nombreFoto.startsWith('images')) {
    return nombreFoto.startsWith('/') ? nombreFoto : `/${nombreFoto}`;
  }
  
  // Si solo es el nombre del archivo, construir el path
  return `/images/${nombreFoto}`;
}

/**
 * Limpiar nombre de foto (solo el nombre del archivo)
 */
private limpiarNombreFotoHuerto(foto: string): string {
  if (!foto) return 'huerto1.jpg';
  
  // Si tiene path, extraer solo el nombre
  if (foto.includes('/')) {
    const partes = foto.split('/');
    return partes[partes.length - 1];
  }
  
  return foto;
}

  getUserAuth(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Obtener todos los huertos del usuario autenticado
   */
  getAllHuertosFirebase(): Observable<Huerto[]> {
    const user = this.getUserAuth();
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
      raw.notas,
      raw.foto  // ← AGREGAR ESTO
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

  // Limpiar el nombre de la foto antes de guardar
  const fotoLimpia = this.limpiarNombreFotoHuerto(huerto.foto || 'huerto1.jpg');

  const datatosave = {
    nombre: huerto.nombre,
    descripcion: huerto.descripcion,
    ubicacion: huerto.ubicacion,
    superficie: huerto.superficie,
    tipo_suelo: huerto.tipo_suelo,
    horas_sol: huerto.horas_sol,
    tiene_riego: huerto.tiene_riego,
    fecha_creacion: huerto.fecha_creacion,
    notas: huerto.notas || '',
    foto: fotoLimpia
  };

  return push(huertoRef, datatosave);
}

  /**
   * Actualizar un huerto (del usuario autenticado)
   */
  updateObject(huerto: Huerto) {
     if (huerto.foto) {
    huerto.foto = this.limpiarNombreFotoHuerto(huerto.foto);
  }
    const user = this.getUserAuth();
    if (!user) {
      return Promise.reject(new Error('Error al modificar el huerto'));
    }

    const uid = user.uid;
    const objectRef = ref(this.database, `users/${uid}/huertos/${huerto.id}`);

    // Incluir el campo foto al guardar
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
      raw.notas,
      raw.foto  // ← AGREGAR ESTO
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