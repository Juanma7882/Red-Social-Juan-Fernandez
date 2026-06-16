import { Inject, Injectable } from '@angular/core';
import { NestAuthService } from './nest.auth.service';
import { environment } from '../../environments/environment';
import { CreatePostDto } from '../models/posts.models';

@Injectable({
  providedIn: 'root',
})
export class NestPostsService {
  private readonly auth = Inject(NestAuthService);
  private readonly apiUrl = `${environment.apiUrl}posts`;

  async createPosts(posts: CreatePostDto) {
    try {
      const response = await this.auth.authenticatedFetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(posts),
      });

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
