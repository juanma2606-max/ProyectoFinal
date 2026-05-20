import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, User, setPersistence, browserLocalPersistence } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private authState$ = authState(this.auth);
  
  constructor() {
    // Asegurar persistencia local
    setPersistence(this.auth, browserLocalPersistence).catch(err => {
      console.error('Error al configurar persistencia:', err);
    });
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getUserAuthenticated(): Observable<User | null> {
    return this.authState$;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  isAdmin(): boolean {
    const user = this.auth.currentUser;
    return user?.email === 'admin@huerting.com';
  }

  isAdmin$(): Observable<boolean> {
    return this.authState$.pipe(
      map(user => user?.email === 'admin@huerting.com')
    );
  }
}