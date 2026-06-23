import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./usuarios/admin-usuarios').then((m) => m.AdminUsuarios),
      },
      {
        path: 'estadisticas',
        loadComponent: () =>
          import('./estadisticas/admin-stats').then((m) => m.AdminStats),
      },
    ],
  },
];
