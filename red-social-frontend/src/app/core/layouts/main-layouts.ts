import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { SessionModal } from '../../shared/components/session-modal/session-modal';
import { NestAuthService } from '../services/nest.auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, Navbar, SessionModal],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    @if (auth.showSessionModal()) {
      <app-session-modal />
    }
  `,
})
export class MainLayout {
  auth = inject(NestAuthService);
}
