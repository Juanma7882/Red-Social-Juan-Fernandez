import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-posts',
  imports: [],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts {
  @Input() id = '';

  @Input() nombreUsuario = '';
  @Input() fechaDeCreacion = '';

  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() imagen = '';
  @Input() imagenPerfil = '';

  @Input() comentarios = '';
  @Input() meGusta = '';
  @Input() isLiked = false;

  @Input() canDelete = false;

  @Output() meGustaToggled = new EventEmitter<string>();
  @Output() deletePost = new EventEmitter<string>();

  isExpanded = false;
  isMenuOpen = false;

  toggleDescription(event: Event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

  onLikeClick(event: Event) {
    event.stopPropagation();
    this.meGustaToggled.emit(this.id);
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = false;
    this.deletePost.emit(this.id);
  }

  @HostListener('document:click')
  closeMenu() {
    this.isMenuOpen = false;
  }
}
