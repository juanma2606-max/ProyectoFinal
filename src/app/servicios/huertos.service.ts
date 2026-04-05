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

  constructor(private database:Database, private auth:Auth ) { }

  getUserAuth():User|null{
    return this.auth.currentUser;
    }

    getAllHuertosFirebase(): Observable<Huerto[]>{
  const user = this.getUserAuth();
  //Si no hay usuario autenticado, devolvemos un array vacío
  if (!user){
    return of([]);
    }

  const uid = user.uid; 
  const huertosRef = ref(this.database, `/huertos/${uid}`);
  return listVal(huertosRef, { keyField: 'id' }) as Observable<Huerto[]>;
}

getHuertosByUid(uid: string): Observable<Huerto[]> {
  const huertosRef = ref(this.database, `/huertos/${uid}`);
  return listVal(huertosRef, { keyField: 'id' }) as Observable<Huerto[]>;
}

async getHuertoById(huertoId:string):Promise<Huerto|null>{

  const user = this.getUserAuth();
  if (!user) {
    return null;
  }
    
  const huertoRef = ref(this.database,`/huertos/${user.uid}/${huertoId}`); 
  const data = await get(huertoRef);

  if (!data.exists()) return null;

  const raw = data.val();

  return new Huerto(
    data.key!,
    raw.nombre,
    raw.descripcion,
    raw.fechaInicio ? new Date(raw.fechaInicio) : new Date(),
    raw.tipo
  );
}

createHuerto(huerto: Huerto) {
  const user = this.getUserAuth();
  if (!user) {
    return Promise.reject(new Error('Usuario no autenticado'))
  }
  const huertoRef = ref(this.database, `/huertos/${user.uid}`);

  const datatosave = {
    nombre: huerto.nombre,
    descripcion: huerto.descripcion,
    tipo: huerto.tipo,
    fechaInicio: new Date().toISOString()
  };

  return push(huertoRef, datatosave);
}

    updateObject(huerto:Huerto){

      const user = this.getUserAuth();
      if (!user) {
        return Promise.reject(new Error('Error al modificar el huerto'));
      }
      
      const uid = user.uid;   
      
      //Ruta correcta: /huertos/${uid}/${huerto.id}
      const objectRef = ref(this.database, `/huertos/${uid}/${huerto.id}`);

    // Limpiamos el objeto: le quitamos el ID y la fecha de creación
    // para no guardarlo en Firebase
    const {id,fecha_creacion,...dataToSave} = huerto;
    return update(objectRef,dataToSave)
  }

      removeObject(huertoId:string): Promise<void>{
      const user = this.getUserAuth();
      if (!user) {
        return Promise.reject(new Error('Error al eliminar el huerto'));
      }
      const uid = user.uid;   

      const objectRef = ref(this.database,`/huertos/${uid}/${huertoId}`);

      return remove(objectRef)
  }

  async getHuertoByUidAndId(uid: string, huertoId: string): Promise<Huerto | null> {
  const huertoRef = ref(this.database, `/huertos/${uid}/${huertoId}`);
  const data = await get(huertoRef);
  if (!data.exists()) return null;
  const raw = data.val();
  return new Huerto(
    data.key!,
    raw.nombre,
    raw.descripcion,
    raw.fechaInicio ? new Date(raw.fechaInicio) : new Date(),
    raw.tipo
  );
}

updateObjectByUid(uid: string, huerto: Huerto) {
  const objectRef = ref(this.database, `/huertos/${uid}/${huerto.id}`);
  const { id, fecha_creacion, ...dataToSave } = huerto;
  return update(objectRef, dataToSave);
}

}
