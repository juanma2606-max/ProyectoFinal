// src/app/servicios/amenazas.service.ts
import { Injectable } from '@angular/core';
import { Database, get, listVal, push, ref, remove, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Amenaza } from '../modelos/amenaza.model';

@Injectable({ providedIn: 'root' })
export class AmenazasService {

  constructor(private database: Database) { }

  /**
   * Obtiene todas las amenazas como Observable
   * Catálogo público: /amenazas
   */
  getAllAmenazasFirebase(): Observable<Amenaza[]> {
    const refPath = ref(this.database, 'amenazas');
    return listVal(refPath, { keyField: 'id' }) as Observable<Amenaza[]>;
  }

  /**
   * Obtiene una amenaza específica por ID
   */
  async getAmenazaById(id: string): Promise<Amenaza | null> {
    const snap = await get(ref(this.database, `amenazas/${id}`));
    
    if (!snap.exists()) return null;
    
    const raw = snap.val();
    
    return new Amenaza(
      raw.nombre ?? '',
      raw.descripcion ?? '',
      raw.tipo ?? 'plaga',
      raw.imagen ?? '',
      raw.sintomas ?? [],
      raw.tratamiento ?? '',
      snap.key!
    );
  }

  /**
   * Crea una nueva amenaza (admin)
   */
  createAmenaza(amenaza: Omit<Amenaza, 'id'>) {
    const dataToSave = {
      nombre: amenaza.nombre,
      descripcion: amenaza.descripcion,
      tipo: amenaza.tipo,
      imagen: amenaza.imagen,
      sintomas: amenaza.sintomas,
      tratamiento: amenaza.tratamiento
    };
    
    return push(ref(this.database, 'amenazas'), dataToSave);
  }

  /**
   * Actualiza una amenaza existente (admin)
   */
  updateAmenaza(amenaza: Amenaza) {
    const { id, ...data } = amenaza;
    return update(ref(this.database, `amenazas/${id}`), data);
  }

  /**
   * Elimina una amenaza (admin)
   */
  removeAmenaza(id: string): Promise<void> {
    return remove(ref(this.database, `amenazas/${id}`));
  }
}