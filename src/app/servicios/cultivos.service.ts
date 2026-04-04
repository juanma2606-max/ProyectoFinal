// src/app/servicios/cultivos.service.ts
import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Database, get, listVal, push, ref, remove, update } from '@angular/fire/database';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Cultivo } from '../modelos/cultivo.model';
@Injectable({
  providedIn: 'root'
})
export class CultivosService {

  constructor(
    private database: Database,
    private auth: Auth,
    private injector: Injector
  ) { }

  /**
   * Devuelve el UID del usuario autenticado.
   * Lanza error si no hay sesión activa.
   */
  private getUserId(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    return user.uid;
  }

  /**
   * Ruta base para los cultivos de un huerto concreto:
   * /cultivos/{uid}/{huertoId}
   */
  private getCultivosRef(huertoId: string) {
    const uid = this.getUserId();
    return ref(this.database, `/cultivos/${uid}/${huertoId}`);
  }

  /**
   * Obtiene todos los cultivos de un huerto como Observable reactivo
   */
  getCultivosByHuerto(huertoId: string): Observable<Cultivo[]> {
    return listVal(this.getCultivosRef(huertoId), { keyField: 'id' }) as Observable<Cultivo[]>;
  }

  /**
   * Obtiene un cultivo específico por su ID
   */
  async getCultivoById(huertoId: string, cultivoId: string): Promise<Cultivo | null> {
    const uid = this.getUserId();
    const cultivoRef = ref(this.database, `/cultivos/${uid}/${huertoId}/${cultivoId}`);
    const snapshot = await get(cultivoRef);

    if (!snapshot.exists()) return null;

    const raw = snapshot.val();

return {
  id: snapshot.key!,
  plantaId:   raw.plantaId   ?? '',
  estado:     raw.estado     ?? 'sana',
  fechaSiembra: raw.fechaSiembra ?? '',
  notas:      raw.notas      ?? '',
  amenazaId:  raw.amenazaId  ?? null  // nuevo campo opcional
};
  }

  /**
   * Crea un nuevo cultivo en el huerto indicado
   */
  createCultivo(huertoId: string, cultivo: Omit<Cultivo, 'id'>) {
    return push(this.getCultivosRef(huertoId), cultivo);
  }

  /**
   * Actualiza un cultivo existente
   */
updateCultivo(huertoId: string, cultivo: Cultivo) {
  const uid = this.getUserId();
  const cultivoRef = ref(this.database, `/cultivos/${uid}/${huertoId}/${cultivo.id}`);
  const { id, ...dataToSave } = cultivo;
  return runInInjectionContext(this.injector, () => update(cultivoRef, dataToSave));
}

  /**
   * Elimina un cultivo por su ID
   */
  removeCultivo(huertoId: string, cultivoId: string): Promise<void> {
    const uid = this.getUserId();
    const cultivoRef = ref(this.database, `/cultivos/${uid}/${huertoId}/${cultivoId}`);
    return remove(cultivoRef);
  }
}