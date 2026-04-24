// src/app/servicios/plantas.service.ts
import { Injectable } from '@angular/core';
import { Database, get, listVal, push, ref, remove, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Planta } from '../modelos/planta.model';

@Injectable({
  providedIn: 'root'
})
export class PlantasService {

  constructor(private database: Database) { }

  /**
   * Obtiene todas las plantas como Observable reactivo
   * Ruta pública: /plantas (cualquier usuario puede leer)
   */
  getAllPlantasFirebase(): Observable<Planta[]> {
    const plantasRef = ref(this.database, 'plantas');
    return listVal(plantasRef, { keyField: 'id' }) as Observable<Planta[]>;
  }

  /**
   * Obtiene una planta específica por su ID (string)
   */
  async getPlantaById(plantaId: string): Promise<Planta | null> {
    const plantaRef = ref(this.database, `plantas/${plantaId}`);
    const snapshot = await get(plantaRef);

    if (!snapshot.exists()) return null;

    const raw = snapshot.val();
    
    return new Planta(
      raw.nombre ?? '',
      raw.descripcion ?? '',
      raw.tipo ?? 'hortaliza',
      raw.imagen ?? '',
      raw.estacion ?? 'todo-año',
      raw.tiempo_crecimiento ?? 0,
      raw.riego ?? 'moderado',
      raw.luz ?? 'pleno-sol',
      raw.abono ?? '',
      raw.incompatibilidades ?? [],
      raw.amenazas ?? [],
      snapshot.key!,
      raw.nombre_cientifico
    );
  }

  /**
   * Crea una nueva planta
   * Firebase genera automáticamente el ID string con push()
   */
  createPlanta(planta: Omit<Planta, 'id'>) {
    const plantasRef = ref(this.database, 'plantas');
    
    const dataToSave: any = {
      nombre: planta.nombre,
      descripcion: planta.descripcion,
      tipo: planta.tipo,
      imagen: planta.imagen,
      estacion: planta.estacion,
      tiempo_crecimiento: planta.tiempo_crecimiento,
      riego: planta.riego,
      luz: planta.luz,
      abono: planta.abono,
      incompatibilidades: planta.incompatibilidades || [],
      amenazas: planta.amenazas || []
    };

    // Solo agregar nombre_cientifico si existe y no es undefined
    if (planta.nombre_cientifico !== undefined && planta.nombre_cientifico !== null) {
      dataToSave.nombre_cientifico = planta.nombre_cientifico;
    }
    
    return push(plantasRef, dataToSave);
  }

  /**
   * Actualiza una planta existente
   * Excluimos el 'id' del objeto a guardar para no sobrescribir la clave
   */
  updatePlanta(planta: Planta) {
    const plantaRef = ref(this.database, `plantas/${planta.id}`);
    
    const dataToSave: any = {
      nombre: planta.nombre,
      descripcion: planta.descripcion,
      tipo: planta.tipo,
      imagen: planta.imagen,
      estacion: planta.estacion,
      tiempo_crecimiento: planta.tiempo_crecimiento,
      riego: planta.riego,
      luz: planta.luz,
      abono: planta.abono,
      incompatibilidades: planta.incompatibilidades || [],
      amenazas: planta.amenazas || []
    };

    // Solo agregar nombre_cientifico si existe y no es undefined
    if (planta.nombre_cientifico !== undefined && planta.nombre_cientifico !== null) {
      dataToSave.nombre_cientifico = planta.nombre_cientifico;
    }

    return update(plantaRef, dataToSave);
  }

  /**
   * Elimina una planta por su ID
   */
  removePlanta(plantaId: string): Promise<void> {
    const plantaRef = ref(this.database, `plantas/${plantaId}`);
    return remove(plantaRef);
  }
}