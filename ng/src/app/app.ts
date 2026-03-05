import {Component, signal, inject, ChangeDetectionStrategy} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from '@core';
import {LucideAngularModule} from 'lucide-angular';
import {NavBrand} from '@ui/view/layout/nav-brand/nav-brand';
import {UiButton} from '@ui/base/button/button';

const SIDEBAR_KEY = 'sidebar_open';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, LucideAngularModule, NavBrand, UiButton],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  public readonly ready = signal(false);
  public readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly sidebarOpen = signal<boolean>(
    localStorage.getItem(SIDEBAR_KEY) !== 'false'
  );

  public get user() {
    return this.auth.getUser();
  }

  constructor() {
    this.auth.ready()
      .then(() => this.ready.set(true))
      .catch((err) => console.error('Auth readiness error:', err));
  }

  toggleSidebar() {
    const next = !this.sidebarOpen();
    this.sidebarOpen.set(next);
    localStorage.setItem(SIDEBAR_KEY, String(next));
  }

  authLogOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
