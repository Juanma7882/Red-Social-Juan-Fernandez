import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NestCommentsService } from '../../../core/services/nest.comments.service';
import { Comment, CommentResponse } from '../../../core/models/comment.model';

@Component({
  selector: 'app-posts',
  imports: [FormsModule, DatePipe],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements AfterViewInit, OnChanges {
  private commentsService = inject(NestCommentsService);

  @Input() id = '';
  @Input() nombreUsuario = '';
  @Input() fechaDeCreacion = '';
  @Input() titulo = '';
  @Input() descripcion = '';
  @Input() imagen = '';
  @Input() imagenPerfil = '';
  @Input() comentarios = '';
  @Input() meGusta = '';
  @Input() isLiked = false;
  @Input() canDelete = false;

  @Output() meGustaToggled = new EventEmitter<string>();
  @Output() deletePost = new EventEmitter<string>();

  @ViewChild('desc') descEl!: ElementRef<HTMLParagraphElement>;

  isExpanded = false;
  isMenuOpen = false;
  isModalOpen = signal(false);
  showVerMas = false;

  comments = signal<CommentResponse | null>(null);
  commentsError = signal(false);
  newComment = '';
  editingId = signal<string | null>(null);
  editingText = '';
  loadingComments = signal(true);

  openModal() {
    this.comments.set(null);
    this.commentsError.set(false);
    this.loadingComments.set(true);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
    this.loadComments(0);
  }

  closeModal() {
    this.isModalOpen.set(false);
    document.body.style.overflow = '';
    this.comments.set(null);
    this.editingId.set(null);
  }

  async loadComments(offset: number) {
    this.loadingComments.set(true);
    try {
      const res = await this.commentsService.getByPost(this.id, 3, offset);
      if (offset === 0) {
        this.comments.set(res);
      } else {
        this.comments.update((prev) =>
          prev ? { ...res, data: [...prev.data, ...res.data] } : res,
        );
      }
    } catch {
      this.commentsError.set(true);
    } finally {
      this.loadingComments.set(false);
    }
  }

  async submitComment() {
    const texto = this.newComment.trim();
    if (!texto) return;
    await this.commentsService.create(this.id, texto);
    this.newComment = '';
    await this.loadComments(0);
  }

  startEdit(comment: Comment) {
    this.editingId.set(comment._id);
    this.editingText = comment.mensaje;
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editingText = '';
  }

  async saveEdit(commentId: string) {
    const texto = this.editingText.trim();
    if (!texto) return;
    await this.commentsService.update(commentId, texto);
    this.cancelEdit();
    await this.loadComments(0);
  }

  async deleteComment(commentId: string) {
    await this.commentsService.delete(commentId);
    await this.loadComments(0);
  }

  get hasMore(): boolean {
    const c = this.comments();
    if (!c) return false;
    return c.data.length < c.total;
  }

  loadMore() {
    const offset = this.comments()?.data.length ?? 0;
    this.loadComments(offset);
  }

  ngAfterViewInit() {
    this.checkOverflow();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['descripcion']) {
      setTimeout(() => this.checkOverflow());
    }
  }

  private checkOverflow() {
    const el = this.descEl?.nativeElement;
    if (el) this.showVerMas = el.scrollHeight > el.clientHeight;
  }

  toggleDescription(event: Event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

  onLikeClick(event: Event) {
    event.stopPropagation();
    this.meGustaToggled.emit(this.id);
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = false;
    this.deletePost.emit(this.id);
  }

  @HostListener('document:click')
  closeMenu() {
    this.isMenuOpen = false;
  }
}
