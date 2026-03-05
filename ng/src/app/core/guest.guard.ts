import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  // on the server, skip redirect decisions so the client can resolve auth
  if (!isPlatformBrowser(platformId)) return true;
  await auth.ready();
  // allow access only when NOT authenticated
  if (!auth.isAuthenticated()) return true;
  // otherwise redirect to protected area
  return router.parseUrl('/protected');
};
