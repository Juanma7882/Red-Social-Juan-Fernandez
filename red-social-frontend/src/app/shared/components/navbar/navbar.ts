import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  collapsed = signal(false);
  showCreate = signal(false);
  showMore = signal(false);

  userAvatar = signal(
    'https://purina.com.pe/sites/default/files/2022-10/Que_debes_saber_antes_de_adoptar_un_gatito.jpg',
  );
  msgBadge = signal(3);
  notiBadge = signal(12);

  createOptions = ['Publicación'];

  moreOptions = [{ icon: '', label: 'Configuración' }];

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

  @HostListener('window:keydown.escape')
  onEscape() {
    this.showCreate.set(false);
    this.showMore.set(false);
  }
}
