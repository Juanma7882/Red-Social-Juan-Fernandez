import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({ selector: '[appDebounceClick]', standalone: true })
export class DebounceClickDirective implements OnDestroy {
  @Input() debounceMs = 500;
  @Output() appDebounceClick = new EventEmitter<MouseEvent>();

  private clicks$ = new Subject<MouseEvent>();
  private sub: Subscription;

  constructor() {
    this.sub = this.clicks$
      .pipe(debounceTime(this.debounceMs))
      .subscribe((e) => this.appDebounceClick.emit(e));
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.clicks$.next(event);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
