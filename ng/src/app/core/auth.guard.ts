import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  // when rendering on the server, don't redirect — allow the client to handle auth
  if (!isPlatformBrowser(platformId)) return true;
  // wait for backend client to load session from storage
  await auth.ready();
  if (auth.isAuthenticated()) return true;
  return router.parseUrl('/login');
};
