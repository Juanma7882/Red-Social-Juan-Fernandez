import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NestAuthService } from '../../../core/services/nest.auth.service';
import { effect } from '@angular/core';
import { CreatePosts } from '../create-posts/create-posts';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, CreatePosts],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  nest = inject(NestAuthService);
  collapsed = signal(false);
  showCreate = signal(false);
  showMore = signal(false);
  ModalCreatePosts = signal(false);
  ModalCloseCreatePosts = signal(false);

  userAvatar = signal<string | null>(null);
  msgBadge = signal(3);
  notiBadge = signal(12);
  isAvatarLoading = signal<boolean>(false);
  avatarError = signal<string | null>(null);
  createOptions = ['Publicación'];

  moreOptions = [{ icon: '', label: 'Configuración' }];

  constructor() {
    effect(() => {
      if (this.nest.isAuthenticated()) {
        this.getIcon();
      } else {
        this.userAvatar.set(null);
      }
    });
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      this.collapsed.set(saved === 'true');
    }
  }

  ngOnInit() {
    if (this.nest.isAuthenticated()) {
      this.getIcon();
    }
  }

  toggleCollapse() {
    this.collapsed.update((v) => !v);
    localStorage.setItem('sidebar-collapsed', String(this.collapsed()));
  }

  async getIcon() {
    try {
      this.isAvatarLoading.set(true);
      this.avatarError.set(null);

      const dataNavbar = await this.nest.userNavbar();
      console.log('dataNavbar', dataNavbar);

      const icon = dataNavbar.imagenPerfil;

      this.userAvatar.set(icon);
      console.log('icon', icon);
    } catch (error) {
      console.error('Error loading user avatar:', error);
      this.avatarError.set('No se pudo cargar la imagen de perfil');
      // Opcional: setear una imagen por defecto
      this.userAvatar.set('/assets/default-avatar.png');
    } finally {
      this.isAvatarLoading.set(false);
    }
  }

  openCreate() {
    this.showCreate.set(true);
  }
  closeCreate() {
    this.showCreate.set(false);
  }
  toggleMore() {
    this.showMore.update((v) => !v);
  }
  closeMore() {
    this.showMore.set(false);
  }
  salir() {
    this.nest.logout();
    window.location.reload();
  }

  showModalCreatePosts() {
    this.showCreate.set(false);
    this.ModalCreatePosts.set(true);
  }

  closeCreatePosts() {
    this.ModalCloseCreatePosts.set(false);
    this.ModalCreatePosts.set(false);
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    this.showCreate.set(false);
    this.showMore.set(false);
  }
}
