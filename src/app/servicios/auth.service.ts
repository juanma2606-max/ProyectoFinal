import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth)
  constructor() { }

  register(email:string, password:string){
    //Devuelve una promesa, si esta se cumple me devuelve la información que haya ingresado el usuario
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login(email:string, password:string){
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  logout(){
    signOut(this.auth)
  }

  getUserAuthenticated():Observable<User|null>{
    return authState(this.auth); 
  }

    getCurrentUser():User|null{
    return this.auth.currentUser;
  }

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

}
