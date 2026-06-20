import { Component, Inject, signal } from '@angular/core';
import { NestAuthService } from '../../core/services/nest.auth.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(@Inject(NestAuthService) private nestAuthService: NestAuthService) {}

  nombre = signal('');
  apellido = signal('');
  email = signal('');
  username = signal('');
  fechaNacimiento = signal('');
  descripcion = signal('');
  imagenPerfil = signal('');
  createdAt = signal('');

  ngOnInit() {
    this.dataProfile();
  }

  async dataProfile() {
    try {
      const profile = await this.nestAuthService.getMyUserProfile();
      this.nombre.set(profile.nombre);
      this.apellido.set(profile.apellido);
      this.email.set(profile.email);
      this.username.set(profile.username);
      this.fechaNacimiento.set(profile.fechaNacimiento);
      this.descripcion.set(profile.descripcion);
      this.imagenPerfil.set(profile.imagenPerfil);
      this.createdAt.set(profile.createdAt);
      console.log('profile', profile);
      
    } catch (error) {
      console.log(error);
    }
  }
  async postsProfile() {}
}
