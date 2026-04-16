import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardUiComponent } from './dashboard-ui.component';

interface StatCard {
  icon: string;
  label: string;
  value: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardUiComponent],
  template: `
    <app-dashboard-ui [userName]="userName()" [statCards]="statCards"></app-dashboard-ui>
  `,
  styles: `
   
  `,
})
export class DashboardComponent {
   private readonly authService = inject(AuthService);
  readonly user = this.authService.currentUser;

   readonly userName = computed(
    () => this.user()?.displayName ?? 'User'
  );

  readonly statCards: StatCard[] = [
    { icon: 'inbox', label: 'Nachrichten', value: '12', color: '#3f51b5' },
    { icon: 'task_alt', label: 'Aufgaben', value: '5', color: '#4caf50' },
    { icon: 'notifications', label: 'Benachrichtigungen', value: '3', color: '#ff9800' },
    { icon: 'people', label: 'Benutzer', value: '24', color: '#9c27b0' },
  ];

}
