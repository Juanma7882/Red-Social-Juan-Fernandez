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
import { Router } from '@angular/router';
import { CloudinaryService } from '../../../core/services/cloudinary.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private nestAuthService = inject(NestAuthService);
  private router = inject(Router);
  private cloudinaryService = inject(CloudinaryService);
  selectedFile: File | null = null;
  previewImage = '';

  regexAge = /^(0?[1-9]|[1-9][0-9]|[1][0-4][0-9]|150)$/;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.selectedFile = file;
    this.previewImage = URL.createObjectURL(file);
    this.profileUser.get('imagenPerfil')?.setValue(file);

    this.profileUser.get('imagenPerfil')?.markAsTouched();

    this.profileUser.get('imagenPerfil')?.updateValueAndValidity();
  }

  validateAge(control: AbstractControl): ValidationErrors | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { underage: true };
  }

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
      imagenPerfil: new FormControl<File | null>(null, [Validators.required]),
      name: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
      correo: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.email]),
      userName: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
      userAge: new FormControl<string>('', [Validators.required, this.validateAge]),
      description: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
      userPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    },
    { validators: this.passwordMatchValidator },
  );

  get getImagenPerfil() {
    return this.profileUser.get('imagenPerfil');
  }

  get getName() {
    return this.profileUser.get('name');
  }

  get getLastName() {
    return this.profileUser.get('lastName');
  }

  get getCorreo() {
    return this.profileUser.get('correo');
  }

  get getUserName() {
    return this.profileUser.get('userName');
  }

  get getUserAge() {
    return this.profileUser.get('userAge');
  }
  get getDescription() {
    return this.profileUser.get('description');
  }

  get getUserPassword() {
    return this.profileUser.get('userPassword');
  }

  get getConfirmPassword() {
    return this.profileUser.get('confirmPassword');
  }

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

  async validateAll() {
    this.errorMessage = '';
    this.profileUser.markAllAsTouched();

    if (this.profileUser.invalid) {
      if (this.profileUser.hasError('passwordMismatch')) {
        this.errorMessage = 'Las contraseñas no coinciden';
      }
      return;
    }
    this.isLoading = true;

    try {
      let imageUrl = '';

      if (this.selectedFile) {
        imageUrl = await this.cloudinaryService.uploadImage(this.selectedFile);
      }

      const signUpData = {
        imagenPerfil: imageUrl,
        nombre: this.getName?.value?.trim() || '',
        apellido: this.getLastName?.value?.trim() || '',
        email: this.getCorreo?.value?.trim() || '',
        username: this.getUserName?.value?.trim() || '',
        password: this.getUserPassword?.value?.trim() || '',
        fechaNacimiento: this.getUserAge?.value || '',
        descripcion: this.getDescription?.value?.trim() || '',
      };

      console.log('Enviando datos de registro:', signUpData);

      const response = await this.nestAuthService.signUp(signUpData);

      if (response && response.token) {
        console.log('Registro exitoso, usuario autenticado');
        await this.router.navigate(['/']);
      } else if (response && response.user) {
        console.log('Registro exitoso, por favor iniciar sesión');
        await this.router.navigate(['/auth/login'], {
          queryParams: { registered: 'true' },
        });
      } else {
        throw new Error('Error en el registro');
      }
    } catch (error: any) {
      console.error('Error en registro:', error);

      if (error.message?.includes('duplicate key') || error.message?.includes('already exists')) {
        this.errorMessage = 'El email ya está registrado';
      } else if (error.message?.includes('validation')) {
        this.errorMessage = 'Por favor, verifica los datos ingresados';
      } else {
        this.errorMessage = error.message || 'Error al registrarse. Por favor, intenta nuevamente';
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      this.isLoading = false;
    }
  }
}
