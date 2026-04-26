import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  
  // 🦴 Crear Observable UNA VEZ en constructor
  private authState$ = authState(this.auth);
  
  constructor() { }

  register(email:string, password:string){
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  login(email:string, password:string){
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  logout(){
    signOut(this.auth)
  }

  getUserAuthenticated():Observable<User|null>{
    return this.authState$; // ← Reusar Observable creado en contexto
  }

  getCurrentUser():User|null{
    return this.auth.currentUser;
  }

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

  // ¡UGH! Método viejo síncrono
  isAdmin(): boolean {
    const user = this.auth.currentUser;
    return user?.email === 'admin@huerting.com';
  }

  // 🦴 NUEVO - Observable reactivo
  isAdmin$(): Observable<boolean> {
    return this.authState$.pipe(
      map(user => user?.email === 'admin@huerting.com')
    );
  }
}