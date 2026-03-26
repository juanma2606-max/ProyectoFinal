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
    const plantasRef = ref(this.database, '/plantas');
    // keyField: 'id' inyecta la clave de Firebase en cada objeto como 'id'
    return listVal(plantasRef, { keyField: 'id' }) as Observable<Planta[]>;
  }

  /**
   * Obtiene una planta específica por su ID (string)
   */
  async getPlantaById(plantaId: string): Promise<Planta | null> {
    const plantaRef = ref(this.database, `/plantas/${plantaId}`);
    const snapshot = await get(plantaRef);

    if (!snapshot.exists()) return null;

    const raw = snapshot.val();
    
    // Construcción del objeto Planta desde los datos crudos de Firebase
    // Usamos el operador ?? para valores por defecto y manejamos campos opcionales
    return {
      id: snapshot.key!,
      nombre: raw.nombre ?? '',
      imagen: raw.imagen ?? '',
      descripcion: raw.descripcion ?? '',
      tipo: raw.tipo ?? 'hortaliza',
      // Campos estructurados (opcionales, pueden no existir en datos antiguos)
      estacion: raw.estacion,
      abono: raw.abono,
      riego: raw.riego,
      tiempoCrecimiento: raw.tiempoCrecimiento,
      incompatibilidades: raw.incompatibilidades ?? [],
      plagas: raw.plagas ?? []
    };
  }

  /**
   * Crea una nueva planta
   * Firebase genera automáticamente el ID string con push()
   */
  createPlanta(planta: Omit<Planta, 'id'>) {
    const plantasRef = ref(this.database, '/plantas');
    // push() devuelve una referencia con la nueva clave generada
    return push(plantasRef, planta);
  }

  /**
   * Actualiza una planta existente
   * Excluimos el 'id' del objeto a guardar para no sobrescribir la clave
   */
  updatePlanta(planta: Planta) {
    const plantaRef = ref(this.database, `/plantas/${planta.id}`);
    const { id, ...dataToSave } = planta; // Eliminamos el id de los datos a actualizar
    return update(plantaRef, dataToSave);
  }

  /**
   * Elimina una planta por su ID
   */
  removePlanta(plantaId: string): Promise<void> {
    const plantaRef = ref(this.database, `/plantas/${plantaId}`);
    return remove(plantaRef);
  }
}