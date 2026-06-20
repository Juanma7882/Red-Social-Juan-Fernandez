import { inject, Injectable } from '@angular/core';
import { NestAuthService } from './nest.auth.service';
import { environment } from '../../../environments/environment';
import { CreatePostDto, PostModel, QueryPostDto } from '../models/posts.models';

@Injectable({
  providedIn: 'root',
})
export class NestPostsService {
  private auth = inject(NestAuthService);
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

  async getPosts(query?: QueryPostDto): Promise<PostModel | Error> {
    try {
      const params = new URLSearchParams();

      if (query?.orderBy) params.append('orderBy', query.orderBy);
      if (query?.userId) params.append('userId', query.userId);
      if (query?.limit) params.append('limit', query.limit);
      if (query?.offset) params.append('offset', query.offset);

      const response = await this.auth.authenticatedFetch(`${this.apiUrl}?${params.toString()}`, {
        method: 'GET',
      });

      return response.json();
    } catch (error) {
      return error as Error;
    }
  }

  async deletePosts(id: string) {
    try {
      const response = await this.auth.authenticatedFetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async likePost(postId: string) {
    try {
      const response = await this.auth.authenticatedFetch(`${this.apiUrl}/${postId}/like`, {
        method: 'POST',
      });

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async unlikePost(postId: string) {
    try {
      const response = await this.auth.authenticatedFetch(`${this.apiUrl}/${postId}/like`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
