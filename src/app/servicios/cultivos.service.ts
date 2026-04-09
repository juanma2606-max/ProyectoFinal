import { Injectable } from '@angular/core';
import { Database, get, listVal, push, ref, remove, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Cultivo } from '../modelos/cultivo.model';

@Injectable({
  providedIn: 'root'
})
export class CultivosService {

  constructor(private database: Database) { }

  private getCultivosRef(uid: string, huertoId: string) {
    return ref(this.database, `/cultivos/${uid}/${huertoId}`);
  }

  getCultivosByHuerto(uid: string, huertoId: string): Observable<Cultivo[]> {
    return listVal(this.getCultivosRef(uid, huertoId), { keyField: 'id' }) as Observable<Cultivo[]>;
  }

  async getCultivoById(uid: string, huertoId: string, cultivoId: string): Promise<Cultivo | null> {
    const cultivoRef = ref(this.database, `/cultivos/${uid}/${huertoId}/${cultivoId}`);
    const snapshot = await get(cultivoRef);
    if (!snapshot.exists()) return null;
    const raw = snapshot.val();
    return {
      id:           snapshot.key!,
      plantaId:     raw.plantaId     ?? '',
      estado:       raw.estado       ?? 'sana',
      fechaSiembra: raw.fechaSiembra ?? '',
      notas:        raw.notas        ?? '',
      amenazaId:    raw.amenazaId    ?? null
    };
  }

  createCultivo(uid: string, huertoId: string, cultivo: Cultivo) {
    const dataToSave = {
      plantaId:     cultivo.plantaId,
      estado:       cultivo.estado,
      fechaSiembra: cultivo.fechaSiembra,
      notas:        cultivo.notas,
      amenazaId:    cultivo.amenazaId ?? null
    };
    return push(this.getCultivosRef(uid, huertoId), dataToSave);
  }

  updateCultivo(uid: string, huertoId: string, cultivo: Cultivo) {
    const cultivoRef = ref(this.database, `/cultivos/${uid}/${huertoId}/${cultivo.id}`);
    const { id, ...dataToSave } = cultivo;
    return update(cultivoRef, dataToSave);
  }

  removeCultivo(uid: string, huertoId: string, cultivoId: string): Promise<void> {
    const cultivoRef = ref(this.database, `/cultivos/${uid}/${huertoId}/${cultivoId}`);
    return remove(cultivoRef);
  }
}