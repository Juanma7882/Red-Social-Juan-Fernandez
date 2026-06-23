import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NestAuthService } from './nest.auth.service';
import {
  AdminUser,
  CreateUserDto,
  StatCommentsByPost,
  StatCommentsOverTime,
  StatPostsByUser,
} from '../models/admin.models';

@Injectable({
  providedIn: 'root',
})
export class NestAdminService {
  private auth = inject(NestAuthService);
  private readonly usersUrl = `${environment.apiUrl}users`;
  private readonly statsUrl = `${environment.apiUrl}stats`;

  async getUsers(): Promise<AdminUser[]> {
    const res = await this.auth.authenticatedFetch(this.usersUrl, { method: 'GET' });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }

  async createUser(dto: CreateUserDto): Promise<AdminUser> {
    const res = await this.auth.authenticatedFetch(this.usersUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message ?? `Error ${res.status}`);
    }
    return res.json();
  }

  async disableUser(id: string): Promise<AdminUser> {
    const res = await this.auth.authenticatedFetch(`${this.usersUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }

  async enableUser(id: string): Promise<AdminUser> {
    const res = await this.auth.authenticatedFetch(`${this.usersUrl}/${id}/enable`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }

  async getPostsByUser(from: string, to: string): Promise<StatPostsByUser[]> {
    const params = new URLSearchParams({ from, to });
    const res = await this.auth.authenticatedFetch(
      `${this.statsUrl}/posts-by-user?${params}`,
      { method: 'GET' },
    );
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }

  async getCommentsOverTime(from: string, to: string): Promise<StatCommentsOverTime[]> {
    const params = new URLSearchParams({ from, to });
    const res = await this.auth.authenticatedFetch(
      `${this.statsUrl}/comments-over-time?${params}`,
      { method: 'GET' },
    );
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }

  async getCommentsByPost(from: string, to: string): Promise<StatCommentsByPost[]> {
    const params = new URLSearchParams({ from, to });
    const res = await this.auth.authenticatedFetch(
      `${this.statsUrl}/comments-by-post?${params}`,
      { method: 'GET' },
    );
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }
}
