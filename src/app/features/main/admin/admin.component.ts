import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { User } from '../../../core/models/user.model';

interface MockUserRow {
  id: number;
  displayName: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  status: 'aktiv' | 'inaktiv';
}

interface SystemStat {
  icon: string;
  label: string;
  value: string;
  status: 'ok' | 'warn' | 'error';
}

@Component({
  selector: 'app-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    MatBadgeModule,
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <mat-icon class="admin-icon">admin_panel_settings</mat-icon>
          <div>
            <h2 class="page-title">Admin-Bereich</h2>
            <p class="page-subtitle">Nur für Administratoren sichtbar</p>
          </div>
        </div>
        <div class="admin-badge">
          <mat-icon>shield</mat-icon>
          <span>Administrator</span>
        </div>
      </div>

      <!-- Systemstatus -->
      <mat-card class="section-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>monitor_heart</mat-icon>
          <mat-card-title>Systemstatus</mat-card-title>
          <mat-card-subtitle>Übersicht der Systemkomponenten</mat-card-subtitle>
        </mat-card-header>
        <mat-divider></mat-divider>
        <mat-card-content>
          <div class="system-grid">
            @for (stat of systemStats; track stat.label) {
              <div class="system-row">
                <mat-icon class="sys-icon" [class]="'status-' + stat.status">
                  {{ stat.icon }}
                </mat-icon>
                <div class="sys-info">
                  <span class="sys-label">{{ stat.label }}</span>
                  <span class="sys-value">{{ stat.value }}</span>
                </div>
                <span class="status-chip" [class]="'chip-' + stat.status">
                  {{ stat.status === 'ok' ? 'OK' : stat.status === 'warn' ? 'Warnung' : 'Fehler' }}
                </span>
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 16px;
        max-width: 1100px;
      }

      @media (min-width: 600px) {
        .page-container {
          padding: 24px;
        }
      }

      .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 24px;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .admin-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: var(--c-primary-light);
      }

      .page-title {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--c-primary);
        transition: color 0.25s ease;
      }

      .page-subtitle {
        margin: 2px 0 0;
        font-size: 0.85rem;
        color: var(--c-text-muted);
        transition: color 0.25s ease;
      }

      .admin-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #e8eaf6;
        color: #3f51b5;
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 0.82rem;
        font-weight: 600;
        white-space: nowrap;
      }

      html.dark-theme .admin-badge {
        background: #1a1f42;
        color: #9fa8da;
      }

      .admin-badge mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .section-card {
        border-radius: 12px !important;
        margin-bottom: 20px;
      }

      mat-card-content {
        padding-top: 8px !important;
      }

      /* === Systemstatus === */
      .system-grid {
        display: flex;
        flex-direction: column;
      }

      .system-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 0;
        border-bottom: 1px solid var(--c-border);
        transition: border-color 0.25s ease;
      }

      .system-row:last-child {
        border-bottom: none;
      }

      .sys-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .status-ok {
        color: #4caf50;
      }
      .status-warn {
        color: #ff9800;
      }
      .status-error {
        color: #f44336;
      }

      .sys-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .sys-label {
        font-size: 0.9rem;
        color: var(--c-text);
        font-weight: 500;
        transition: color 0.25s ease;
      }

      .sys-value {
        font-size: 0.78rem;
        color: var(--c-text-muted);
        transition: color 0.25s ease;
      }

      .status-chip {
        font-size: 0.75rem;
        font-weight: 600;
        border-radius: 12px;
        padding: 2px 10px;
      }
    `,
  ],
})
export class AdminComponent {
  readonly systemStats: SystemStat[] = [
    { icon: 'dns', label: 'API-Server', value: 'Erreichbar unter localhost:3000', status: 'ok' },
    { icon: 'storage', label: 'Datenbank', value: 'SQLite – 12 MB belegt', status: 'ok' },
    {
      icon: 'security',
      label: 'Authentifizierung',
      value: 'JWT aktiv, Ablauf in 23 h',
      status: 'ok',
    },
    {
      icon: 'memory',
      label: 'Arbeitsspeicher',
      value: '78 % belegt (Warnschwelle: 80 %)',
      status: 'warn',
    },
    { icon: 'backup', label: 'Backup', value: 'Letztes Backup: vor 3 Tagen', status: 'warn' },
  ];
}
