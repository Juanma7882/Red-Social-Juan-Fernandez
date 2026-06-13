import { Component, inject } from '@angular/core';
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

  inValidCredential = false;
  isLoading = false; // Añadido para mostrar estado de carga
  showPassword = false;

  profileForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]), // Cambiado a 8 para coincidir con tu template
  });

  get username() {
    return this.profileForm.get('username');
  }

  get password() {
    return this.profileForm.get('password');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  logInQuickly() {
    this.profileForm.patchValue({
      username: 'juanmaf236@gmail.com',
      password: '12345678',
    });
  }

  async onSubmit() {
    this.inValidCredential = false;
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;

    try {
      const response = await this.nestAuthService.signIn({
        user: this.username?.value || '',
        password: this.password?.value || '',
      });

      if (response && response.token) {
        console.log('Login exitoso');
        this.router.navigateByUrl('/');
      } else {
        this.inValidCredential = true;
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.inValidCredential = true;
    } finally {
      this.isLoading = false;
    }
  }
}
