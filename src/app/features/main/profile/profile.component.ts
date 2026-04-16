import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="page-container">
      <h2 class="page-title">Mein Profil</h2>

      <div class="profile-layout">
        <!-- Avatar Card -->
        <mat-card class="avatar-card">
          <mat-card-content>
            <div class="avatar-section">
              <div class="avatar-circle">
                <span>{{ initials() }}</span>
              </div>
              <p class="avatar-name">{{ user()?.displayName }}</p>
              <mat-chip-set>
                <mat-chip [highlighted]="true" color="primary">
                  <mat-icon matChipAvatar>shield</mat-icon>
                  {{ user()?.role === 'admin' ? 'Administrator' : 'Benutzer' }}
                </mat-chip>
              </mat-chip-set>
            </div>

            <div class="info-list">
              <div class="info-row">
                <mat-icon>person</mat-icon>
                <div>
                  <small>Benutzername</small>
                  <p>{{ user()?.username }}</p>
                </div>
              </div>
              <div class="info-row">
                <mat-icon>email</mat-icon>
                <div>
                  <small>E-Mail</small>
                  <p>{{ user()?.email }}</p>
                </div>
              </div>
              <div class="info-row">
                <mat-icon>verified_user</mat-icon>
                <div>
                  <small>Rolle</small>
                  <p>{{ user()?.role }}</p>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Edit Card -->
        <mat-card class="edit-card">
          <mat-card-header>
            <mat-card-title>Profil bearbeiten</mat-card-title>
            <mat-card-subtitle>Anzeigename und E-Mail aktualisieren</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="onSave()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Anzeigename</mat-label>
                <input matInput formControlName="displayName" id="input-displayname" />
                <mat-icon matSuffix>badge</mat-icon>
                @if (
                  profileForm.controls.displayName.invalid &&
                  profileForm.controls.displayName.touched
                ) {
                  <mat-error>Anzeigename ist erforderlich</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>E-Mail</mat-label>
                <input matInput formControlName="email" id="input-email" type="email" />
                <mat-icon matSuffix>email</mat-icon>
                @if (profileForm.controls.email.invalid && profileForm.controls.email.touched) {
                  <mat-error>
                    @if (profileForm.controls.email.errors?.['required']) {
                      E-Mail ist erforderlich
                    } @else if (profileForm.controls.email.errors?.['email']) {
                      Ungültige E-Mail-Adresse
                    }
                  </mat-error>
                }
              </mat-form-field>

              @if (saved()) {
                <div class="success-banner">
                  <mat-icon>check_circle</mat-icon>
                  <span>Änderungen erfolgreich gespeichert (lokal).</span>
                </div>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" id="btn-reset-profile" (click)="onReset()">
                  Zurücksetzen
                </button>
                <button
                  mat-raised-button
                  color="primary"
                  type="submit"
                  id="btn-save-profile"
                  [disabled]="profileForm.invalid || profileForm.pristine"
                >
                  Speichern
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 16px;
        max-width: 1000px;
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

      .profile-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
      }

      @media (min-width: 860px) {
        .profile-layout {
          grid-template-columns: 280px 1fr;
          gap: 24px;
        }
      }

      .avatar-card,
      .edit-card {
        border-radius: 12px !important;
      }

      .avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 0 24px;
        gap: 12px;
      }

      .avatar-circle {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--c-avatar-1), var(--c-avatar-2));
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: 700;
        color: white;
        box-shadow: 0 4px 16px rgba(63, 81, 181, 0.3);
        transition: background 0.25s ease;
      }

      .avatar-name {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--c-text);
        margin: 0;
        transition: color 0.25s ease;
      }

      .info-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 16px 0;
        border-top: 1px solid var(--c-border);
        transition: border-color 0.25s ease;
      }

      .info-row {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .info-row mat-icon {
        color: var(--c-text-muted);
        margin-top: 4px;
        transition: color 0.25s ease;
      }

      .info-row small {
        display: block;
        font-size: 0.75rem;
        color: var(--c-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: color 0.25s ease;
      }

      .info-row p {
        margin: 2px 0 0;
        color: var(--c-text);
        font-size: 0.95rem;
        transition: color 0.25s ease;
      }

      .full-width {
        width: 100%;
        margin-bottom: 8px;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
      }

      .success-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--c-success-bg);
        border: 1px solid var(--c-success-border);
        border-radius: 8px;
        padding: 10px 16px;
        margin-bottom: 12px;
        color: var(--c-success-text);
        font-size: 0.875rem;
        transition:
          background 0.25s ease,
          color 0.25s ease;
      }

      mat-card-content {
        padding-top: 16px !important;
      }
    `,
  ],
})
export class ProfileComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser;
  readonly saved = signal(false);

  readonly initials = () => {
    const name = this.user()?.displayName ?? '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  readonly profileForm = this.fb.nonNullable.group({
    displayName: [this.user()?.displayName ?? '', Validators.required],
    email: [this.user()?.email ?? '', [Validators.required, Validators.email]],
  });

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.saved.set(true);
    this.profileForm.markAsPristine();
    setTimeout(() => this.saved.set(false), 4000);
  }

  onReset(): void {
    this.profileForm.reset({
      displayName: this.user()?.displayName ?? '',
      email: this.user()?.email ?? '',
    });
    this.saved.set(false);
  }
}
