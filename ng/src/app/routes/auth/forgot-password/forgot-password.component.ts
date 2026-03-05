import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '@core/user.service';
import { UiButton } from '@ui/base/button/button';
import { UiInput } from '@ui/base/input/input';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, UiInput, UiButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly userService = inject(UserService);

  readonly loading = signal(false);
  readonly sent = signal(false);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  isInvalid(): boolean {
    const c = this.form.controls.email;
    return c.invalid && c.touched;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    try {
      await this.userService.requestPasswordReset(this.form.getRawValue().email);
      this.sent.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
