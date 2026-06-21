import { Component, Inject, signal } from '@angular/core';
import { NestAuthService } from '../../core/services/nest.auth.service';
import { NestPostsService } from '../../core/services/nest.posts.service';
import { SIGNAL } from '@angular/core/primitives/signals';
import { orderBy, PostModel } from '../../core/models/posts.models';
import { Posts } from '../../shared/components/posts/posts';

@Component({
  selector: 'app-profile',
  imports: [Posts],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(
    @Inject(NestAuthService) private nestAuthService: NestAuthService,
    private nestPostsService: NestPostsService,
  ) {}

  nombre = signal('');
  apellido = signal('');
  email = signal('');
  username = signal('');
  fechaNacimiento = signal('');
  descripcion = signal('');
  imagenPerfil = signal('');
  createdAt = signal('');

  orderByOptions: orderBy[] = Object.values(orderBy);
  currentlyOrderBy = signal<orderBy>(orderBy.fecha);
  userId = signal('');
  offset = signal(0);
  limit = signal(3);

  posts = signal<PostModel | null>(null);
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  ngOnInit() {
    const id = this.nestAuthService.currentUser()?._id;
    if (id) this.userId.set(id);
    this.dataProfile();
    if (id) {
      this.postsProfile();
    }
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
  async onLike(postId: string) {
    const post = this.posts()?.data.find(p => p._id === postId);
    if (!post) return;
    if (post.isLiked) {
      await this.nestPostsService.unlikePost(postId);
    } else {
      await this.nestPostsService.likePost(postId);
    }
    await this.postsProfile();
  }

  async onDelete(postId: string) {
    await this.nestPostsService.deletePosts(postId);
    await this.postsProfile();
  }

  async postsProfile() {
    try {
      const response = await this.nestPostsService.getPosts({
        userId: this.userId(),
        orderBy: this.currentlyOrderBy(),
        limit: String(this.limit()),
        offset: String(this.offset()),
      });
      if (!(response instanceof Error)) this.posts.set(response);
    } catch (error) {
      console.log(error);
    }
  }
}
