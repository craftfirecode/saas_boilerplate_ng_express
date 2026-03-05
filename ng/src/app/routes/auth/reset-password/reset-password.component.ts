import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { UserService } from "@core/user.service";
import { UiButton } from "@ui/base/button/button";
import { UiInput } from "@ui/base/input/input";
type Status = "form" | "success" | "invalid-token";
@Component({
  selector: "app-reset-password",
  imports: [ReactiveFormsModule, RouterLink, UiInput, UiButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./reset-password.component.html",
})
export class ResetPasswordComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  readonly status = signal<Status>("form");
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private token = "";
  readonly form = new FormGroup({
    newPassword: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    confirmPassword: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get("token");
    if (!token) {
      this.status.set("invalid-token");
      return;
    }
    this.token = token;
  }
  isInvalid(field: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[field];
    return c.invalid && c.touched;
  }
  get passwordsMismatch(): boolean {
    const { newPassword, confirmPassword } = this.form.getRawValue();
    return this.form.controls.confirmPassword.touched && newPassword !== confirmPassword;
  }
  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.passwordsMismatch) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);
    const { newPassword, confirmPassword } = this.form.getRawValue();
    try {
      await this.userService.confirmPasswordReset(this.token, newPassword, confirmPassword);
      this.status.set("success");
    } catch (err: unknown) {
      const apiError = (err as { error?: { error?: string } })?.error?.error;
      this.errorMessage.set(apiError ?? "Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      this.loading.set(false);
    }
  }
}
