import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private http = inject(HttpClient);

  private cloudName = environment.CLOUD_NAME;
  private uploadPreset = 'red-social-profile';

  async uploadImage(file: File) {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    const response = await firstValueFrom(this.http.post<any>(url, formData));

    return response.secure_url;
  }
}
