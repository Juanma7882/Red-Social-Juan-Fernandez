import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NestAuthService } from '../../../core/services/nest.auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink], // Añadido RouterLink para el enlace de registro
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private nestAuthService = inject(NestAuthService);
  private router = inject(Router);

  inValidCredential = signal(false);
  isLoading = signal(false);
  showPassword = signal(false);

  profileForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });

  get username() {
    return this.profileForm.get('username');
  }

  get password() {
    return this.profileForm.get('password');
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  logInQuickly() {
    this.profileForm.patchValue({
      username: 'juanmaf236@gmail.com',
      password: '12345678',
    });
  }

  async onSubmit() {
    this.inValidCredential.set(false);
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await this.nestAuthService.signIn({
        identifier: this.username?.value || '',
        password: this.password?.value || '',
      });

      if (response && response.token) {
        console.log('Login exitoso');
        this.router.navigateByUrl('/');
      } else {
        this.inValidCredential.set(true);
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.inValidCredential.set(true);
      this.isLoading.set(false);
    }
  }
}
