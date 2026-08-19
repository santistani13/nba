import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})
export class CreateAccount {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService)
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  constructor(){

  }

  async submit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();
    this._loading.set(true);
    try {
      const res = await firstValueFrom(
        this.authService.register(email, password)
      );

      this.toastService.success(res.message);

      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 1500);

    } catch (err: any) {
      this.toastService.error(
        err.error?.message || 'Error al crear usuario'
      );
    } finally {
      this._loading.set(false);
    }
  }
}
