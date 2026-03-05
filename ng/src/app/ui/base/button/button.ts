import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation, inject, booleanAttribute } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Component({
  selector: 'button[uiButton], a[uiButton]',
  standalone: true,
  imports: [],
  template: '<ng-content />',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
})
export class UiButton {
  readonly variant = input<ButtonVariant>('default');
  readonly size = input<ButtonSize>('default');
  readonly activeClass = input<string>('bg-gray-100 text-green-500');
  readonly exact = input(true, { transform: booleanAttribute });
  readonly icon = input(false, { transform: booleanAttribute });

  private readonly router = inject(Router);
  private readonly link = inject(RouterLink, { optional: true, self: true });

  private readonly routeChanged = toSignal(
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
  );

  protected readonly isActive = computed(() => {
    this.routeChanged();

    if (!this.link?.urlTree) {
      return false;
    }

    return this.router.isActive(this.link.urlTree, {
      paths: this.exact() ? 'exact' : 'subset',
      queryParams: this.exact() ? 'exact' : 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  });

  protected readonly classes = computed(() => {
    const v = this.variant();
    const s = this.size();

    let base = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300';

    if (this.icon()) {
      base += ' gap-5';
    }

    let variantClasses = '';
    switch (v) {
      case 'default':
        variantClasses = 'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90';
        break;
      case 'destructive':
        variantClasses = 'border border-red-500 text-red-500 hover:bg-red-500/90 hover:text-white dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90';
        break;
      case 'outline':
        variantClasses = 'border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50';
        break;
      case 'secondary':
        variantClasses = 'bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80';
        break;
      case 'ghost':
        variantClasses = 'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50';
        break;
      case 'link':
        variantClasses = 'text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50';
        break;
    }

    if (this.isActive()) {
      variantClasses += ` ${this.activeClass()}`;
    }

    let sizeClasses = '';
    switch (s) {
      case 'default':
        sizeClasses = 'h-10 px-4 py-2';
        break;
      case 'sm':
        sizeClasses = 'h-9 rounded-md px-3';
        break;
      case 'lg':
        sizeClasses = 'h-11 rounded-md px-8';
        break;
      case 'icon':
        sizeClasses = 'h-10 w-10';
        break;
    }

    return `${base} ${variantClasses} ${sizeClasses}`;
  });
}
