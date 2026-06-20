// post-feed.ts (contenedor / smart component)
import { Component, inject, Input, signal } from '@angular/core';
// import { Post } from '../post/post';
// import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-posts',
  imports: [],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts {
  @Input() nombreUsuario = '';
  @Input() fechaDeCreacion = '';

  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() imagen = '';
  @Input() imagenPerfil = '';

  @Input() comentarios = '';
  @Input() meGusta = '';

  isExpanded = false;

  toggleDescription(event: Event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }
}
