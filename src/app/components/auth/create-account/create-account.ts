import { Component, inject } from '@angular/core';
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
  
  constructor(){

  }

  async submit() {
    console.log('entre en el btnm', this.form.value)
    if (this.form.invalid) return;
  
    const { email, password } = this.form.getRawValue();
    console.log(email,password)
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
    }
  }
}
