import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },

{
    path: 'main',
    loadComponent: () =>
      import('./features/main/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/main/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/main/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/main/admin/admin.component').then(
            (m) => m.AdminComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/main/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
