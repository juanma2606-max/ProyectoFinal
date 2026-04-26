import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { map } from 'rxjs/operators';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AdminGuard: verificar si usuario es admin');
  
  return authService.isAdmin$().pipe(
    map(esAdmin => {
      if (esAdmin) {
        console.log('AdminGuard: acceso permitido');
        return true;
      }
      
      console.log('AdminGuard: acceso denegado, redirigir a acceso-denegado');
      router.navigate(['/acceso-denegado']);
      return false;
    })
  );
};