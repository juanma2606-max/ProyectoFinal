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
    return ref(this.database, `users/${uid}/huertos/${huertoId}/cultivos`);
  }

  getCultivosByHuerto(uid: string, huertoId: string): Observable<Cultivo[]> {
    return listVal(this.getCultivosRef(uid, huertoId), { keyField: 'id' }) as Observable<Cultivo[]>;
  }

  async getCultivoById(uid: string, huertoId: string, cultivoId: string): Promise<Cultivo | null> {
    const cultivoRef = ref(this.database, `users/${uid}/huertos/${huertoId}/cultivos/${cultivoId}`);
    const snapshot = await get(cultivoRef);
    
    if (!snapshot.exists()) return null;
    
    const raw = snapshot.val();
    
    return new Cultivo(
      raw.nombre ?? 'Cultivo sin nombre',
      raw.plantaId ?? '',
      raw.fecha_siembra ?? '',
      raw.estado ?? 'plantado',
      raw.cantidad ?? 1,
      raw.notas ?? '',
      raw.amenazaId ?? null,
      snapshot.key!
    );
  }

  createCultivo(uid: string, huertoId: string, cultivo: Cultivo) {
    const dataToSave = {
      nombre: cultivo.nombre,
      plantaId: cultivo.plantaId,
      fecha_siembra: cultivo.fecha_siembra,
      estado: cultivo.estado,
      cantidad: cultivo.cantidad,
      notas: cultivo.notas,
      amenazaId: cultivo.amenazaId ?? null
    };
    
    return push(this.getCultivosRef(uid, huertoId), dataToSave);
  }

  updateCultivo(uid: string, huertoId: string, cultivo: Cultivo) {
    const cultivoRef = ref(this.database, `users/${uid}/huertos/${huertoId}/cultivos/${cultivo.id}`);
    
    const dataToSave = {
      nombre: cultivo.nombre,
      plantaId: cultivo.plantaId,
      fecha_siembra: cultivo.fecha_siembra,
      estado: cultivo.estado,
      cantidad: cultivo.cantidad,
      notas: cultivo.notas,
      amenazaId: cultivo.amenazaId ?? null
    };
    
    return update(cultivoRef, dataToSave);
  }

  removeCultivo(uid: string, huertoId: string, cultivoId: string): Promise<void> {
    const cultivoRef = ref(this.database, `users/${uid}/huertos/${huertoId}/cultivos/${cultivoId}`);
    return remove(cultivoRef);
  }
}