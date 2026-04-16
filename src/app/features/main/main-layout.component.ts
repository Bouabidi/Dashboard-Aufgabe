import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  id: string;
  requiredRole?: 'admin' | 'user';
}

const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-main-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav
        #sidenav
        [mode]="sidenavMode()"
        [opened]="sidenavOpen()"
        (openedChange)="sidenavOpen.set($event)"
        class="app-sidenav"
      >
        <div class="sidenav-header">
          <mat-icon class="brand-icon">dashboard_customize</mat-icon>
          <span class="brand-name">Dashboard</span>
        </div>

        <mat-divider></mat-divider>

        <mat-nav-list class="nav-list">
          @for (item of visibleNavItems(); track item.route) {
            <a
              mat-list-item
              [routerLink]="item.route"
              routerLinkActive="nav-item-active"
              [id]="item.id"
              (click)="onNavClick()"
            >
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>

        <div class="sidenav-footer">
          <mat-divider></mat-divider>
          <div class="user-info">
            <div class="user-avatar-small">{{ initials() }}</div>
            <div class="user-text">
              <p class="user-name">{{ authService.currentUser()?.displayName }}</p>
              <p class="user-role">{{ authService.currentUser()?.role }}</p>
            </div>
          </div>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content class="main-content">
        <!-- Topbar -->
        <mat-toolbar class="app-toolbar" color="primary">
          <button
            mat-icon-button
            id="btn-toggle-sidenav"
            (click)="toggleSidenav()"
            aria-label="Menü öffnen/schließen"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <span class="toolbar-title">Dashboard</span>
          <span class="spacer"></span>

          <!-- Dark Mode Toggle -->
          <button
            mat-icon-button
            id="btn-toggle-darkmode"
            (click)="themeService.toggleDarkMode()"
            [matTooltip]="themeService.isDarkMode() ? 'Hell-Modus' : 'Dunkel-Modus'"
            aria-label="Dark Mode umschalten"
          >
            <mat-icon>{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>

          <button
            mat-icon-button
            [matMenuTriggerFor]="userMenu"
            id="btn-user-menu"
            aria-label="Benutzermenü"
          >
            <div class="user-avatar-btn">{{ initials() }}</div>
          </button>

          <mat-menu #userMenu="matMenu">
            <div class="menu-user-header">
              <strong>{{ authService.currentUser()?.displayName }}</strong>
              <small>{{ authService.currentUser()?.email }}</small>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item routerLink="/main/profile" id="menu-profile">
              <mat-icon>person</mat-icon>
              Profil
            </button>
            <button mat-menu-item routerLink="/main/settings" id="menu-settings">
              <mat-icon>settings</mat-icon>
              Einstellungen
            </button>
            @if (authService.currentUser()?.role === 'admin') {
              <button mat-menu-item routerLink="/main/admin" id="menu-admin">
                <mat-icon>admin_panel_settings</mat-icon>
                Admin-Bereich
              </button>
            }
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()" id="btn-logout">
              <mat-icon color="warn">logout</mat-icon>
              Abmelden
            </button>
          </mat-menu>
        </mat-toolbar>

        <!-- Page Content -->
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .sidenav-container {
      height: 100vh;
    }

    .app-sidenav {
      width: 260px;
      border-right: none !important;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 20px 16px;
    }

    .brand-icon {
      color: var(--c-brand-icon);
      font-size: 28px;
      width: 28px;
      height: 28px;
      transition: color 0.25s ease;
    }

    .brand-name {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--c-primary);
      letter-spacing: 0.5px;
      transition: color 0.25s ease;
    }

    .nav-list {
      padding: 8px;
    }

    .nav-list a {
      border-radius: 8px;
      margin-bottom: 4px;
      transition: background-color 0.2s ease;
    }

    :host ::ng-deep .nav-item-active {
      background: var(--c-nav-active-bg) !important;
      color: var(--c-nav-active) !important;
    }

    :host ::ng-deep .nav-item-active .mat-icon {
      color: var(--c-nav-active) !important;
    }

    .sidenav-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
    }

    .user-text {
      overflow: hidden;
    }

    .user-avatar-small {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--c-avatar-1), var(--c-avatar-2));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 600;
      flex-shrink: 0;
      transition: background 0.25s ease;
    }

    .user-name {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--c-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.25s ease;
    }

    .user-role {
      margin: 0;
      font-size: 0.75rem;
      color: var(--c-text-muted);
      text-transform: capitalize;
      transition: color 0.25s ease;
    }

    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .toolbar-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-left: 8px;
    }

    .spacer {
      flex: 1;
    }

    .user-avatar-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .menu-user-header {
      display: flex;
      flex-direction: column;
      padding: 12px 16px;
    }

    .menu-user-header small {
      color: var(--c-text-muted);
      font-size: 0.78rem;
      margin-top: 2px;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      background: var(--c-bg);
      min-height: 100vh;
      transition: background-color 0.25s ease;
    }

    .content-area {
      flex: 1;
    }
  `,
})
export class MainLayoutComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  readonly sidenavOpen = signal(true);
  readonly sidenavMode = signal<'side' | 'over'>('side');

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/main/dashboard', id: 'nav-dashboard' },
    {
      label: 'Admin-Bereich',
      icon: 'admin_panel_settings',
      route: '/main/admin',
      id: 'nav-admin',
      requiredRole: 'admin',
    },
    { label: 'Profil', icon: 'person', route: '/main/profile', id: 'nav-profile' },
    { label: 'Einstellungen', icon: 'settings', route: '/main/settings', id: 'nav-settings' },
  ];

  readonly visibleNavItems = computed(() => {
    const userRole = this.authService.currentUser()?.role;
    return this.navItems.filter((item) => !item.requiredRole || item.requiredRole === userRole);
  });

  ngOnInit(): void {
    this.updateSidenavForScreenSize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;
    this.updateSidenavForScreenSize(width);
  }

  private updateSidenavForScreenSize(width: number): void {
    if (width < MOBILE_BREAKPOINT) {
      this.sidenavMode.set('over');
      this.sidenavOpen.set(false);
    } else {
      this.sidenavMode.set('side');
      this.sidenavOpen.set(true);
    }
  }

  readonly initials = () => {
    const name = this.authService.currentUser()?.displayName ?? '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  toggleSidenav(): void {
    this.sidenavOpen.update((v) => !v);
  }

  onNavClick(): void {
    if (this.sidenavMode() === 'over') {
      this.sidenavOpen.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
