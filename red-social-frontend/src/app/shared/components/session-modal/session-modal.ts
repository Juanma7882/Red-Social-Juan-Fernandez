import { Component, inject } from '@angular/core';
import { NestAuthService } from '../../../core/services/nest.auth.service';

@Component({
  selector: 'app-session-modal',
  standalone: true,
  templateUrl: './session-modal.html',
})
export class SessionModal {
  private auth = inject(NestAuthService);
  private renewing = false;

  async renew(): Promise<void> {
    if (this.renewing) return;
    this.renewing = true;
    await this.auth.renewSession();
    this.renewing = false;
  }

  dismiss(): void {
    this.auth.hideSessionModal();
  }
}
