import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../core/services/theme.service';
//import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  template: `
    <div class="page-container">
      <h2 class="page-title">Einstellungen</h2>

      <form [formGroup]="settingsForm" (ngSubmit)="onSave()">
        <!-- Darstellung -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>palette</mat-icon>
            <mat-card-title>Darstellung</mat-card-title>
            <mat-card-subtitle>Passen Sie das Erscheinungsbild an</mat-card-subtitle>
          </mat-card-header>
          <mat-divider></mat-divider>
          <mat-card-content>
            <!-- Dark Mode – direkt verdrahtet mit ThemeService -->
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-name">Dark Mode</p>
                 <p class="setting-desc">
                  {{ themeService.isDarkMode() ? 'Dunkles Design aktiv' : 'Helles Design aktiv' }}
                </p>
              </div>
               <mat-slide-toggle
                id="toggle-darkmode"
                color="primary"
                [checked]="themeService.isDarkMode()"
                (change)="themeService.toggleDarkMode()"
              >
                <mat-icon>{{ themeService.isDarkMode() ? 'dark_mode' : 'light_mode' }}</mat-icon>
              </mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-name">Sprache</p>
                <p class="setting-desc">Anzeigesprache der Anwendung</p>
              </div>
              <mat-form-field appearance="outline" class="lang-select">
                <mat-select formControlName="language" id="select-language">
                  <mat-option value="de">🇩🇪 Deutsch</mat-option>
                  <mat-option value="en">🇬🇧 English</mat-option>
                  <mat-option value="fr">🇫🇷 Français</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Benachrichtigungen -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>notifications</mat-icon>
            <mat-card-title>Benachrichtigungen</mat-card-title>
            <mat-card-subtitle>Steuern Sie Ihre Benachrichtigungen</mat-card-subtitle>
          </mat-card-header>
          <mat-divider></mat-divider>
          <mat-card-content>
            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-name">E-Mail-Benachrichtigungen</p>
                <p class="setting-desc">Benachrichtigungen per E-Mail erhalten</p>
              </div>
              <mat-slide-toggle
                formControlName="emailNotifications"
                id="toggle-email-notifications"
                color="primary"
              ></mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <div class="setting-row">
              <div class="setting-info">
                <p class="setting-name">Push-Benachrichtigungen</p>
                <p class="setting-desc">Browser-Benachrichtigungen aktivieren</p>
              </div>
              <mat-slide-toggle
                formControlName="pushNotifications"
                id="toggle-push-notifications"
                color="primary"
              ></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>


      </form>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 16px;
        max-width: 720px;
      }

      @media (min-width: 600px) {
        .page-container {
          padding: 24px;
        }
      }

      .page-title {
        margin: 0 0 24px;
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--c-primary);
        transition: color 0.25s ease;
      }

      .settings-card {
        border-radius: 12px !important;
        margin-bottom: 20px;
      }

      mat-card-content {
        padding-top: 0 !important;
      }

      .setting-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 0;
        gap: 12px;
        flex-wrap: wrap;
      }

      .setting-info {
        flex: 1;
        min-width: 180px;
      }

      .setting-name {
        margin: 0;
        font-weight: 500;
        color: var(--c-text);
        transition: color 0.25s ease;
      }

      .setting-desc {
        margin: 2px 0 0;
        font-size: 0.82rem;
        color: var(--c-text-muted);
        transition: color 0.25s ease;
      }

      .lang-select {
        min-width: 140px;
        width: 100%;
        max-width: 200px;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 8px;
      }

      .success-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--c-success-bg);
        border: 1px solid var(--c-success-border);
        border-radius: 8px;
        padding: 10px 16px;
        margin-bottom: 16px;
        color: var(--c-success-text);
        font-size: 0.875rem;
        transition:
          background 0.25s ease,
          color 0.25s ease;
      }
    `,
  ],
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  readonly themeService = inject(ThemeService);
  readonly saved = signal(false);

  readonly settingsForm = this.fb.nonNullable.group({
    language: ['de'],
    emailNotifications: [true],
    pushNotifications: [false],
    analytics: [false],
  });

  onSave(): void {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 4000);
  }

  onReset(): void {
    this.settingsForm.reset({
      language: 'de',
      emailNotifications: true,
      pushNotifications: false,
      analytics: false,
    });
    this.saved.set(false);
  }
}
