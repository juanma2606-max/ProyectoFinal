// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  console.log('AuthGuard: verificar usuario');

  return authState(auth).pipe(
    take(1), // ← Tomar solo primer valor y completar
    map(user => {
      if (user) {
        console.log('AuthGuard: usuario autenticado, permitir acceso');
        return true;
      }
      
      console.log('AuthGuard: NO autenticado, redirigir a login');
      router.navigate(['/login']);
      return false;
    })
  );
};