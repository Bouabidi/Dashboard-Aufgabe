import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';


describe('authGuard', () => {
  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = { url: '/main/dashboard' } as RouterStateSnapshot;

  function runGuard(): boolean | UrlTree {
    return TestBed.runInInjectionContext(() =>
      authGuard(dummyRoute, dummyState)
    ) as boolean | UrlTree;
  }

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
      ],
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('sollte erstellt werden können', () => {
    expect(authGuard).toBeTruthy();
  });

  it('sollte true zurückgeben wenn der Benutzer eingeloggt ist', () => {
    // Einloggen
    const authService = TestBed.inject(AuthService);
    authService.login('admin', 'admin123');

    const result = runGuard();

    expect(result).toBe(true);
  });

  it('sollte einen UrlTree nach /login zurückgeben wenn nicht eingeloggt', () => {
    // Nicht eingeloggt – localStorage ist leer
    const result = runGuard();

    expect(result).toBeInstanceOf(UrlTree);
    const urlTree = result as UrlTree;
    expect(urlTree.toString()).toBe('/login');
  });

  it('sollte nach Logout den Zugriff verweigern', () => {
    const authService = TestBed.inject(AuthService);
    authService.login('admin', 'admin123');
    authService.logout();

    const result = runGuard();

    expect(result).toBeInstanceOf(UrlTree);
  });
});
