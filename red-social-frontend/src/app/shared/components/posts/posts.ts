// post-feed.ts (contenedor / smart component)
import { Component, inject, signal } from '@angular/core';
// import { Post } from '../post/post';
// import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-posts',
  imports: [],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts {
  // private postsService = inject(PostsService);
  // posts = signal<PostModel[]>([]);
  // constructor() {
  //   this.postsService.getPosts().subscribe((data) => this.posts.set(data));
  // }
}
