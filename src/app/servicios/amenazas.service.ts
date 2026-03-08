// src/app/servicios/amenazas.service.ts
import { Injectable } from '@angular/core';
import { Database, get, listVal, push, ref, remove, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Amenaza } from '../modelos/amenaza';

@Injectable({ providedIn: 'root' })
export class AmenazasService {

  constructor(private database: Database) { }

  getAllAmenazasFirebase(): Observable<Amenaza[]> {
    const refPath = ref(this.database, '/amenazas');
    return listVal(refPath, { keyField: 'id' }) as Observable<Amenaza[]>;
  }

  async getAmenazaById(id: string): Promise<Amenaza | null> {
    const snap = await get(ref(this.database, `/amenazas/${id}`));
    if (!snap.exists()) return null;
    const raw = snap.val();
    return {
      id: snap.key!,
      nombre: raw.nombre ?? '',
      imagen: raw.imagen ?? '',
      descripcion: raw.descripcion ?? '',
      tipo: raw.tipo ?? 'plaga',
      sintomas: raw.sintomas ?? [],
      tratamiento: raw.tratamiento,
    };
  }

  createAmenaza(amenaza: Omit<Amenaza, 'id'>) {
    return push(ref(this.database, '/amenazas'), amenaza);
  }

  updateAmenaza(amenaza: Amenaza) {
    const { id, ...data } = amenaza;
    return update(ref(this.database, `/amenazas/${id}`), data);
  }

  removeAmenaza(id: string): Promise<void> {
    return remove(ref(this.database, `/amenazas/${id}`));
  }
}