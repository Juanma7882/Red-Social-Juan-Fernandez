import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CloudinaryService } from '../../../core/services/cloudinary.service';
import { NestPostsService } from '../../../core/services/nest.posts.service';
import { CreatePostDto } from '../../../core/models/posts.models';

@Component({
  selector: 'app-create-posts',
  imports: [ReactiveFormsModule],
  templateUrl: './create-posts.html',
  styleUrl: './create-posts.css',
})
export class CreatePosts {
  @Output() close = new EventEmitter<void>();

  private nestPostsService = inject(NestPostsService);
  private cloudinaryService = inject(CloudinaryService);

  selectedFile = signal<File | null>(null);
  previewImage = signal<string>('');
  modalError = signal<string>('');
  isLoading = signal<boolean>(false);

  newPosts = new FormGroup({
    titulo: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    mensaje: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    imagen: new FormControl<string | undefined>(undefined, [Validators.required]),
  });

  async uploadImage(event: Event) {
    try {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) return;

      this.isLoading.set(true);
      const file = input.files[0];
      this.selectedFile.set(file);

      // Crear preview local
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage.set(reader.result as string);
      };
      reader.readAsDataURL(file);

      const imgUrl = await this.cloudinaryService.uploadImage(file);
      console.log('imgUrl', imgUrl);
      this.newPosts.patchValue({ imagen: imgUrl });

      this.modalError.set('Imagen subida exitosamente');
      setTimeout(() => this.modalError.set(''), 3000);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      this.modalError.set('Error al subir la imagen');
    } finally {
      this.isLoading.set(false);
    }
  }

  async uploadPost() {
    if (this.newPosts.invalid) {
      this.newPosts.markAllAsTouched();
      return;
    }

    try {
      this.isLoading.set(true);
      const postData = this.newPosts.value;

      const response = (await this.nestPostsService.createPosts(postData as CreatePostDto)) as { ok: boolean };
      if (response.ok) {
        this.newPosts.reset();
        this.previewImage.set('');
        this.selectedFile.set(null);
        this.nestPostsService.notifyPostCreated();
        this.closeModal();
      } else {
        throw new Error('Error al crear la publicación');
      }
    } catch (error) {
      console.error('Error al crear post:', error);
      this.modalError.set('Error al crear la publicación. Intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onFileCancel() {
    this.newPosts.get('imagen')?.markAsTouched();
  }

  deleteImage() {
    this.previewImage.set('');
    this.selectedFile.set(null);
    this.newPosts.patchValue({ imagen: undefined });
  }

  get titulo() {
    return this.newPosts.get('titulo');
  }

  get mensaje() {
    return this.newPosts.get('mensaje');
  }

  get imagen() {
    return this.newPosts.get('imagen');
  }

  get profileName(): string {
    return 'Usuario';
  }

  closeModal() {
    this.close.emit();
  }
  cancel() {
    this.closeModal();
  }
}
