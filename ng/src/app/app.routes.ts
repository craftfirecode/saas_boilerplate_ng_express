import { Routes } from '@angular/router';
import { guestGuard, authGuard } from './core';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@routes/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('@routes/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'verify-email',
    loadComponent: () => import('@routes/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
  },
  {
    path: 'verify-email-change',
    loadComponent: () => import('@routes/auth/verify-email-change/verify-email-change.component').then(m => m.VerifyEmailChangeComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('@routes/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () => import('@routes/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  {
    path: 'confirm-delete-account',
    loadComponent: () => import('@routes/auth/confirm-delete-account/confirm-delete-account.component').then(m => m.ConfirmDeleteAccountComponent),
  },
  {
    path: 'protected',
    loadComponent: () => import('./routes/protected/root.component').then(m => m.RootComponent),
    canActivate: [authGuard]
  },
  {
    path: 'protected/settings',
    loadComponent: () => import('./routes/protected/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'testing/email',
    loadComponent: () => import('./routes/testing/email/email-test.component').then(m => m.EmailTestComponent),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'protected', pathMatch: 'full' },
  { path: '**', redirectTo: 'protected' }
];
