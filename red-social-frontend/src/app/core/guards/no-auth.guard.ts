// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NestAuthService } from '../services/nest.auth.service';

export const noAuthGuard: CanActivateFn = async () => {
  const nestAuthService = inject(NestAuthService);
  const router = inject(Router);
  const session = await nestAuthService.validateToken();

  if (!session) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
