import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NestAdminService } from '../../../core/services/nest.admin.service';
import { AdminUser, CreateUserDto } from '../../../core/models/admin.models';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-usuarios.html',
})
export class AdminUsuarios implements OnInit {
  private adminService = inject(NestAdminService);

  users = signal<AdminUser[]>([]);
  loading = signal(false);
  showForm = signal(false);
  formLoading = signal(false);
  formError = signal<string | null>(null);

  form: CreateUserDto = {
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    password: '',
    fechaNacimiento: '',
    perfil: 'usuario',
  };

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.loading.set(true);
    try {
      const data = await this.adminService.getUsers();
      this.users.set(data);
      console.log(data);
    } catch {
      // silencioso, tabla queda vacía
    } finally {
      this.loading.set(false);
    }
  }

  openForm() {
    this.form = {
      nombre: '',
      apellido: '',
      email: '',
      username: '',
      password: '',
      fechaNacimiento: '',
      perfil: 'usuario',
    };
    this.formError.set(null);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  async submitForm() {
    this.formLoading.set(true);
    this.formError.set(null);
    try {
      await this.adminService.createUser(this.form);
      this.showForm.set(false);
      await this.loadUsers();
    } catch (e: any) {
      this.formError.set(e?.message ?? 'Error al crear usuario');
    } finally {
      this.formLoading.set(false);
    }
  }

  async toggleHabilitado(user: AdminUser) {
    try {
      const updated = user.habilitado
        ? await this.adminService.disableUser(user._id)
        : await this.adminService.enableUser(user._id);
      this.users.update((list) => list.map((u) => (u._id === updated._id ? updated : u)));
    } catch {
      // silencioso
    }
  }
}
