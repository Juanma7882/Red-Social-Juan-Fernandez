import { inject, Injectable } from '@angular/core';
import { NestAuthService } from './nest.auth.service';
import { environment } from '../../../environments/environment';
import { CommentResponse } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class NestCommentsService {
  private auth = inject(NestAuthService);
  private readonly apiUrl = `${environment.apiUrl}comments`;

  async getByPost(postId: string, limit = 3, offset = 0): Promise<CommentResponse> {
    const params = new URLSearchParams({
      postId,
      limit: String(limit),
      offset: String(offset),
    });
    const res = await this.auth.authenticatedFetch(`${this.apiUrl}?${params}`);
    return await res.json();
  }

  async create(postId: string, mensaje: string): Promise<void> {
    await this.auth.authenticatedFetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, mensaje }),
    });
  }

  async update(commentId: string, mensaje: string): Promise<void> {
    await this.auth.authenticatedFetch(`${this.apiUrl}/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje }),
    });
  }

  async delete(commentId: string): Promise<void> {
    await this.auth.authenticatedFetch(`${this.apiUrl}/${commentId}`, {
      method: 'DELETE',
    });
  }
}
