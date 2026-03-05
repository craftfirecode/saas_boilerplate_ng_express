import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation, booleanAttribute } from '@angular/core';

export type InputVariant = 'default' | 'error';
export type InputSize = 'default' | 'sm' | 'lg';

@Component({
  selector: 'input[uiInput]',
  standalone: true,
  template: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
  },
})
export class UiInput {
  readonly variant = input<InputVariant>('default');
  readonly size = input<InputSize>('default');
  readonly full = input(true, { transform: booleanAttribute });

  protected readonly classes = computed(() => {
    const v = this.variant();
    const s = this.size();

    const base =
      'rounded-md border bg-surface-card px-3 py-2 text-sm transition-colors ' +
      'placeholder:text-content-placeholder ' +
      'focus:outline-none focus:ring-2 focus:ring-offset-0 ' +
      'disabled:pointer-events-none disabled:opacity-50';

    let variantClasses = '';
    switch (v) {
      case 'default':
        variantClasses = 'border-border focus:ring-brand';
        break;
      case 'error':
        variantClasses = 'border-danger-border focus:ring-danger-text-soft';
        break;
    }

    let sizeClasses = '';
    switch (s) {
      case 'default':
        sizeClasses = 'h-10';
        break;
      case 'sm':
        sizeClasses = 'h-8 text-xs';
        break;
      case 'lg':
        sizeClasses = 'h-12 text-base';
        break;
    }

    const widthClass = this.full() ? 'w-full' : '';

    return `${base} ${variantClasses} ${sizeClasses} ${widthClass}`.trim();
  });
}
