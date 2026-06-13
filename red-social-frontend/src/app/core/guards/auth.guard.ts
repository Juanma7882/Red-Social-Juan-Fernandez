// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NestAuthService } from '../services/nest.auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(NestAuthService);
  const router = inject(Router);

  // Primero verificación rápida local
  if (!authService.getToken()) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }, // Guardar URL para redirigir después
    });
  }

  // Verificación real contra el backend
  try {
    const isValid = await authService.validateToken();

    if (isValid) {
      return true;
    }

    // Token inválido, limpiar y redirigir
    authService.logout();
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url, sessionExpired: true },
    });
  } catch (error) {
    console.error('Auth validation error:', error);
    return router.createUrlTree(['/auth/login'], {
      queryParams: { error: 'auth_error' },
    });
  }
};
