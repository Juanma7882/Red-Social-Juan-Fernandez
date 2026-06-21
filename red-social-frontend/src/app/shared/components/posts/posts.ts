import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-posts',
  imports: [],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements AfterViewInit, OnChanges {
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
  showVerMas = false;

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
