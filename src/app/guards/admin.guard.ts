import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { map } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🦴 Guard ejecutar');
  
  return authService.isAdmin$().pipe(
    map(esAdmin => {
      if (esAdmin) {
        console.log('🦴 Guard: acceso permitido');
        return true;
      }
      
      console.log('🦴 Guard: acceso denegado, redirigir');
      router.navigate(['/app/home']);
      return false;
    })
  );
};