import { Injectable } from '@angular/core';
import { Database, get, listVal, push, ref, remove, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Auth, User } from '@angular/fire/auth';
import { Person } from '../modelos/person.model';


@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private database: Database,private auth: Auth) { }

  getAllPersons() {
    const personsRef = ref(this.database, '/users');
    return listVal(personsRef) as Observable<Person[]>;
  }

  async getPersonById(id: string): Promise<Person | null> {
    const objectRef = ref(this.database, `/users/${id}`);
    const data = await get(objectRef);

    if (data.exists()) {
      // Devolvemos el objeto con el ID inyectado
      return { uid: data.key!, ...data.val() } as Person;    }
    return null;
  }

  async createPerson(person: Person) {
    const objectRef = ref(this.database,  `/users/${person.uid}`);
    // Limpiamos el objeto: le quitamos el ID para no guardarlo en Firebase
    const { uid, ...dataToSave } = person;
    return update(objectRef, dataToSave);
  }

  updatePersonFirebase(person: Person) {
    const objectRef = ref(this.database, `/users/${person.uid}`);
    // Limpiamos el objeto: le quitamos el ID para no guardarlo en Firebase
    const { uid, ...dataToSave } = person;
    return update(objectRef, dataToSave);
  }

   getUserAuth(): User | null {
      return this.auth.currentUser;
    }

  removePerson(id: string): Promise<void> {
    const objectRef = ref(this.database, `/users/${id}`);
    return remove(objectRef);
  }   
}