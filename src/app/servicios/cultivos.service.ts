import { Injectable } from '@angular/core';
import { Database, get, listVal, push, ref, remove, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Cultivo } from '../modelos/cultivo.model';

@Injectable({
  providedIn: 'root'
})
export class CultivosService {

  constructor(private database: Database) { }

  /**
   * Obtener referencia a los cultivos de un huerto
   */
  private getCultivosRef(uid: string, huertoId: string) {
    return ref(this.database, `users/${uid}/huertos/${huertoId}/cultivos`);
  }

  /**
   * Obtener todos los cultivos de un huerto
   */
  getCultivosByHuerto(uid: string, huertoId: string): Observable<Cultivo[]> {
    return listVal(this.getCultivosRef(uid, huertoId), { keyField: 'id' }) as Observable<Cultivo[]>;
  }

  /**
   * Obtener un cultivo específico por ID
   */
  async getCultivoById(uid: string, huertoId: string, cultivoId: string): Promise<Cultivo | null> {
    const cultivoRef = ref(this.database, `users/${uid}/huertos/${huertoId}/cultivos/${cultivoId}`);
    const snapshot = await get(cultivoRef);
    
    if (!snapshot.exists()) return null;
    
    const raw = snapshot.val();
    
    return new Cultivo(
      raw.plantaId ?? '',
      raw.fecha_siembra ?? '',
      raw.estado ?? 'plantado',
      raw.cantidad ?? 1,
      raw.notas ?? '',
      raw.amenazaId ?? null,
      snapshot.key!
    );
  }

  /**
   * Crear un nuevo cultivo en un huerto
   */
  createCultivo(uid: string, huertoId: string, cultivo: Cultivo) {
    const dataToSave = {
      plantaId: cultivo.plantaId,
      fecha_siembra: cultivo.fecha_siembra,
      estado: cultivo.estado,
      cantidad: cultivo.cantidad,
      notas: cultivo.notas,
      amenazaId: cultivo.amenazaId ?? null
    };
    
    return push(this.getCultivosRef(uid, huertoId), dataToSave);
  }

  /**
   * Actualizar un cultivo existente
   */
  updateCultivo(uid: string, huertoId: string, cultivo: Cultivo) {
    const cultivoRef = ref(this.database, `users/${uid}/huertos/${huertoId}/cultivos/${cultivo.id}`);
    const { id, ...dataToSave } = cultivo;
    return update(cultivoRef, dataToSave);
  }

  /**
   * Eliminar un cultivo
   */
  removeCultivo(uid: string, huertoId: string, cultivoId: string): Promise<void> {
    const cultivoRef = ref(this.database, `users/${uid}/huertos/${huertoId}/cultivos/${cultivoId}`);
    return remove(cultivoRef);
  }
}