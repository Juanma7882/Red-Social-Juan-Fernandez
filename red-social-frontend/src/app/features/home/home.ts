import { AfterViewInit, Component, effect, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { Posts as PostsComponent } from '../../shared/components/posts/posts';
import { NestPostsService } from '../../core/services/nest.posts.service';
import { NestAuthService } from '../../core/services/nest.auth.service';
import { orderBy, Posts as PostModel } from '../../core/models/posts.models';

@Component({
  selector: 'app-home',
  imports: [PostsComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {
  readonly orderBy = orderBy;
  readonly listOrder: orderBy[] = [orderBy.fecha, orderBy.likes, orderBy.guardados, orderBy.compartidos];
  readonly orderLabels: Record<orderBy, string> = {
    [orderBy.fecha]: 'Fecha',
    [orderBy.likes]: 'Likes',
    [orderBy.guardados]: 'Guardados',
    [orderBy.compartidos]: 'Compartidos',
  };
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

  constructor(
    private nestPostService: NestPostsService,
    private authService: NestAuthService,
  ) {
    effect(() => {
      const count = this.nestPostService.postCreated();
      if (count > 0) {
        this.offset = 0;
        this.currentPage = 1;
        this.getPosts(true);
      }
    });
  }

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
      console.log(posts);
      if (posts instanceof Error) {
        console.error(posts);
        return;
      }

      const currentUserId = this.authService.currentUser()?._id;
      const userRole = this.authService.userRole();
      const isAdmin = userRole === 'administrador';
      const postsWithLiked = posts.data.map((post) => ({
        ...post,
        isLiked: currentUserId ? post.likes.some((id: any) => id.toString() === currentUserId) : false,
        canDelete: isAdmin || (!!currentUserId && post.usuarioId._id === currentUserId),
      }));

      if (resetPosts) {
        this.postsList.set(postsWithLiked);
      } else {
        this.postsList.update((currentPosts) => [...currentPosts, ...postsWithLiked]);
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

  async handleLike(postId: string): Promise<void> {
    const postIndex = this.postsList().findIndex((p) => p._id === postId);
    if (postIndex === -1) return;

    const post = this.postsList()[postIndex];
    const isCurrentlyLiked = post.isLiked || false;
    const currentUserId = this.authService.currentUser()?._id || '';

    try {
      if (isCurrentlyLiked) {
        await this.nestPostService.unlikePost(postId);
      } else {
        await this.nestPostService.likePost(postId);
      }

      this.postsList.update((posts) => {
        const updatedPosts = [...posts];
        const updatedLikes = isCurrentlyLiked
          ? updatedPosts[postIndex].likes.filter((id: any) => id.toString() !== currentUserId)
          : [...updatedPosts[postIndex].likes, currentUserId];
        updatedPosts[postIndex] = {
          ...updatedPosts[postIndex],
          isLiked: !isCurrentlyLiked,
          likes: updatedLikes,
        };
        return updatedPosts;
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  async handleDelete(postId: string): Promise<void> {
    try {
      await this.nestPostService.deletePosts(postId);
      this.postsList.update((posts) => posts.filter((p) => p._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
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

  async onOrderChange(event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const selectedOrder = select.value as orderBy;

    if (this.currentOrder === selectedOrder) return;

    this.currentOrder = selectedOrder;
    this.offset = 0;
    this.currentPage = 1;
    await this.getPosts(true);
  }
}
