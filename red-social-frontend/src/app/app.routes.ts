import { Routes } from '@angular/router';
import { MainLayout } from './core/layouts/main-layouts';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/loading/loading').then((m) => m.Loading),
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        canActivate: [authGuard],
      },
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
        canActivate: [authGuard],
      },
      {
        path: '**',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        canActivate: [authGuard],
      },
    ],
  },
];
