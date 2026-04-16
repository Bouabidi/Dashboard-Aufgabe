import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {StatCard} from '../../../core/models/stat-card.model';


@Component({
  selector: 'app-dashboard-ui',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, MatDividerModule],
  template: `
    <div class="page-container">
      <div class="welcome-section">
        <mat-icon class="welcome-icon">waving_hand</mat-icon>
        <div>
          <h2 class="welcome-title">
            Willkommen, {{ userName() }}!
          </h2>
          <p class="welcome-sub">
            Schön, Sie wieder zu sehen. Hier ist eine Übersicht Ihrer Aktivitäten.
          </p>
        </div>
      </div>

      <div class="stats-grid">
        @for (card of statCards(); track card.label) {
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-row">
                <div class="stat-info">
                  <p class="stat-label">{{ card.label }}</p>
                  <p class="stat-value">{{ card.value }}</p>
                </div>
                <div class="stat-icon-wrap" [style.background]="card.color">
                  <mat-icon>{{ card.icon }}</mat-icon>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 16px;
      max-width: 1100px;
    }

    @media (min-width: 600px) {
      .page-container {
        padding: 24px;
      }
    }

    .welcome-section {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .welcome-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #ff9800;
    }

    .welcome-title {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--c-primary);
      transition: color 0.25s ease;
    }

    .welcome-sub {
      margin: 4px 0 0;
      color: var(--c-text-muted);
      transition: color 0.25s ease;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    @media (min-width: 600px) {
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }
    }

    .stat-card {
      border-radius: 12px !important;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .stat-info {
      min-width: 0;
      flex: 1;
    }

    .stat-label {
      margin: 0;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--c-text-muted);
      transition: color 0.25s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (min-width: 600px) {
      .stat-label {
        font-size: 0.8rem;
        letter-spacing: 1px;
      }
    }

    .stat-value {
      margin: 4px 0 0;
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--c-text);
      transition: color 0.25s ease;
    }

    @media (min-width: 600px) {
      .stat-value {
        font-size: 2rem;
      }
    }

    .stat-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    @media (min-width: 600px) {
      .stat-icon-wrap {
        width: 52px;
        height: 52px;
        border-radius: 12px;
      }
    }

    .stat-icon-wrap mat-icon {
      color: white;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    @media (min-width: 600px) {
      .stat-icon-wrap mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

  `],
})
export class DashboardUiComponent {
  readonly userName = input.required<string>();
  readonly statCards = input.required<StatCard[]>();
}
