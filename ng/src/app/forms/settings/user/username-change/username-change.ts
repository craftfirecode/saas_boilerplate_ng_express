import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '@core';
import { UserService } from '@core/user.service';
import { UiButton} from '@ui/base/button/button';
import { UiInput } from '@ui/base/input/input';

function noWhitespace(control: AbstractControl): ValidationErrors | null {
  return /\s/.test(control.value ?? '') ? { whitespace: true } : null;
}

@Component({
  selector: 'app-username-change',
  templateUrl: './username-change.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, UiButton, UiInput],
})
export class UsernameChange {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  public usernameControl = new FormControl('', {
    validators: [Validators.required, noWhitespace]
  });
  public status = signal<'idle' | 'success' | 'taken' | 'spaces' | 'error'>('idle');

  public get user() {
    return this.auth.user();
  }

  constructor() {
    effect(() => {
      const username = this.auth.user()?.username;
      if (username && this.usernameControl.value !== username) {
        this.usernameControl.setValue(username, { emitEvent: false });
      }
    });
  }

  async updateUsername() {
    if (this.usernameControl.invalid) return;
    this.status.set('idle');
    const newVal = this.usernameControl.value;
    try {
      await this.userService.updateProfile(newVal!);
      await this.auth.reloadUserObject();
      this.status.set('success');
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 409) {
        this.status.set('taken');
      } else if (status === 400) {
        this.status.set('spaces');
      } else {
        this.status.set('error');
      }
    }
  }
}
