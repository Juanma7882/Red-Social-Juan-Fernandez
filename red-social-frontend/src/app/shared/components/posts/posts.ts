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

  @Input() meGusta = '';
  // @Input() comentarios = '';

  isExpanded = false;

  toggleDescription(event: Event) {
    event.stopPropagation(); // Evita que el click se propague
    this.isExpanded = !this.isExpanded;
  }

  // private postsService = inject(PostsService);
  // posts = signal<PostModel[]>([]);
  // constructor() {
  //   this.postsService.getPosts().subscribe((data) => this.posts.set(data));
  // }
}
