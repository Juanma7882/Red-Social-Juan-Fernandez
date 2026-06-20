import { AfterViewInit, Component, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { Posts as PostsComponent } from '../../shared/components/posts/posts';
import { NestPostsService } from '../../core/services/nest.posts.service';
import { orderBy, Posts as PostModel } from '../../core/models/posts.models';

@Component({
  selector: 'app-home',
  imports: [PostsComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {
  private readonly listOrder: orderBy[] = [orderBy.fecha, orderBy.likes, orderBy.guardados, orderBy.compartidos];
  private currentOrder = this.listOrder[0];
  private offset: number = 0;
  private limit: number = 2;
  totalPages = 1;
  currentPage = 1;

  postsList = signal<PostModel[]>([]);
  isLoading = signal<boolean>(false);

  @ViewChild('loadMoreTrigger')
  loadMoreTrigger!: ElementRef;
  private observer!: IntersectionObserver;
  private isFetching = false;

  constructor(private nestPostService: NestPostsService) {}

  ngOnInit() {
    this.getPosts();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.isLoading() && this.currentPage < this.totalPages) {
          this.loadNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );

    this.observer.observe(this.loadMoreTrigger.nativeElement);
  }

  async loadNextPage() {
    if (this.isFetching) return;

    this.isFetching = true;

    try {
      this.offset += this.limit;
      await this.getPosts();
    } finally {
      this.isFetching = false;
    }
    console.log('tamos', this.postsList());
  }

  async getPosts(resetPosts: boolean = false): Promise<void> {
    try {
      this.isLoading.set(true);

      const posts = await this.nestPostService.getPosts({
        offset: this.offset.toString(),
        limit: this.limit.toString(),
        orderBy: this.currentOrder,
      });

      if (posts instanceof Error) {
        console.error(posts);
        return;
      }

      if (resetPosts) {
        this.postsList.set(posts.data);
      } else {
        this.postsList.update((currentPosts) => [...currentPosts, ...posts.data]);
      }

      this.totalPages = posts.totalPages;
      this.currentPage = posts.page;
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async nextPage(): Promise<void> {
    if (this.currentPage >= this.totalPages) return;

    this.offset += this.limit;
    this.currentPage++;
    await this.getPosts();
  }

  async changeOrder(order: orderBy): Promise<void> {
    if (this.currentOrder === order) return;

    this.currentOrder = order;
    this.offset = 0;
    this.currentPage = 1;
    await this.getPosts(true);
  }

  get order(): orderBy {
    return this.currentOrder;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }
}
