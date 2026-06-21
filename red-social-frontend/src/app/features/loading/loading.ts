import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NestAuthService } from '../../core/services/nest.auth.service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading implements OnInit {
  private auth = inject(NestAuthService);
  private router = inject(Router);
  currentlyStatus = signal('loading');
  status: 'loading' | 'success' | 'error' = 'loading';

  async ngOnInit(): Promise<void> {
    const valid = await this.auth.validateToken();
    this.status = valid ? 'success' : 'error';

    setTimeout(() => {
      this.currentlyStatus.set(this.status);
    }, 5000);
    setTimeout(() => {
      if (valid) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/auth/login']);
      }
    }, 10000);
  }
}
