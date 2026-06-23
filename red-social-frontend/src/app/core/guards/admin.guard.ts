import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NestAuthService } from '../services/nest.auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(NestAuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  if (auth.userRole() !== 'administrador') {
    return router.createUrlTree(['/home']);
  }

  return true;
};
