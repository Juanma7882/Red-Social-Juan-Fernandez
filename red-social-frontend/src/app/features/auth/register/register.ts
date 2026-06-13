import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NestAuthService } from '../../../core/services/nest.auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private nestAuthService = inject(NestAuthService);
  private router = inject(Router);

  // Validadores personalizados
  regexAge = /^(0?[1-9]|[1-9][0-9]|[1][0-4][0-9]|150)$/;

  // Validador personalizado para contraseñas coincidentes
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('userPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  profileUser = new FormGroup(
    {
      correo: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.email]),
      userName: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
      userLastName: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
      userAge: new FormControl<string>('', [Validators.required, Validators.pattern(this.regexAge)]),
      userPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    },
    { validators: this.passwordMatchValidator },
  );

  // Getters para facilitar el acceso
  get getCorreo() {
    return this.profileUser.get('correo');
  }

  get getUserName() {
    return this.profileUser.get('userName');
  }

  get getUserLastName() {
    return this.profileUser.get('userLastName');
  }

  get getUserAge() {
    return this.profileUser.get('userAge');
  }

  get getUserPassword() {
    return this.profileUser.get('userPassword');
  }

  get getConfirmPassword() {
    return this.profileUser.get('confirmPassword');
  }

  // Estados de UI
  valuePassword = false;
  valueConfirmPassword = false;
  isLoading = false;
  errorMessage = '';

  togglePassword() {
    this.valuePassword = !this.valuePassword;
  }

  toggleConfirmPassword() {
    this.valueConfirmPassword = !this.valueConfirmPassword;
  }

  // Convierte edad (número) a fecha de nacimiento (ISO string)
  private convertAgeToBirthDate(age: string): string {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - parseInt(age);
    // Asumimos 1 de enero como fecha de nacimiento si solo tenemos la edad
    return `${birthYear}-01-01T00:00:00.000Z`;
  }

  async validateAll() {
    // Resetear estados
    this.errorMessage = '';
    this.profileUser.markAllAsTouched();

    // Verificar si el formulario es válido
    if (this.profileUser.invalid) {
      // Mostrar mensaje de error general si es necesario
      if (this.profileUser.hasError('passwordMismatch')) {
        this.errorMessage = 'Las contraseñas no coinciden';
      }
      return;
    }

    this.isLoading = true;

    try {
      // Preparar datos según la interfaz SignUpAuth de Nest.js
      const signUpData = {
        nombre: this.getUserName?.value || '',
        apellido: this.getUserLastName?.value || '',
        email: this.getCorreo?.value || '',
        username: this.getCorreo?.value?.split('@')[0] || '', // Genera username del email o puedes agregar un campo separado
        password: this.getUserPassword?.value || '',
        fechaNacimiento: this.convertAgeToBirthDate(this.getUserAge?.value || '0'),
        descripcion: '', // Campo opcional, puedes agregarlo al formulario si lo deseas
      };

      console.log('Enviando datos de registro:', signUpData);

      const response = await this.nestAuthService.signUp(signUpData);

      // Verificar respuesta exitosa
      if (response && response.token) {
        console.log('Registro exitoso, usuario autenticado');
        // El usuario ya está autenticado después del registro
        await this.router.navigate(['/']);
      } else if (response && response.user) {
        // Si el registro no devuelve token automáticamente pero sí el usuario
        console.log('Registro exitoso, por favor iniciar sesión');
        await this.router.navigate(['/auth/login'], {
          queryParams: { registered: 'true' },
        });
      } else {
        throw new Error('Error en el registro');
      }
    } catch (error: any) {
      console.error('Error en registro:', error);

      // Manejar diferentes tipos de errores
      if (error.message?.includes('duplicate key') || error.message?.includes('already exists')) {
        this.errorMessage = 'El email ya está registrado';
      } else if (error.message?.includes('validation')) {
        this.errorMessage = 'Por favor, verifica los datos ingresados';
      } else {
        this.errorMessage = error.message || 'Error al registrarse. Por favor, intenta nuevamente';
      }

      // Scroll al top para ver el error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      this.isLoading = false;
    }
  }
}
