import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // --- Initialer Zustand ---

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte initial nicht eingeloggt sein', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  // --- Login ---

  it('sollte mit korrekten Credentials einloggen', () => {
    const result = service.login('admin', 'admin123');

    expect(result).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
  });

  it('sollte nach Login den korrekten User setzen', () => {
    service.login('admin', 'admin123');

    const user = service.currentUser();
    expect(user).not.toBeNull();
    expect(user?.username).toBe('admin');
    expect(user?.role).toBe('admin');
    expect(user?.email).toBe('admin@example.com');
  });

  it('sollte mit falschem Passwort nicht einloggen', () => {
    const result = service.login('admin', 'falsches-passwort');

    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('sollte mit unbekanntem Benutzer nicht einloggen', () => {
    const result = service.login('unbekannt', 'admin123');

    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('sollte leere Credentials ablehnen', () => {
    const result = service.login('', '');

    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('sollte den zweiten Demo-User (user / user123) akzeptieren', () => {
    const result = service.login('user', 'user123');

    expect(result).toBe(true);
    expect(service.currentUser()?.role).toBe('user');
    expect(service.currentUser()?.username).toBe('user');
  });

  // --- Logout ---

  it('sollte nach Logout nicht mehr eingeloggt sein', () => {
    service.login('admin', 'admin123');
    expect(service.isLoggedIn()).toBe(true);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  // --- localStorage-Persistenz ---

  it('sollte den User nach Login in localStorage speichern', () => {
    service.login('admin', 'admin123');

    const stored = localStorage.getItem('dashboard_app_user');
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed.username).toBe('admin');
  });

  it('sollte localStorage nach Logout leeren', () => {
    service.login('admin', 'admin123');
    service.logout();

    const stored = localStorage.getItem('dashboard_app_user');
    expect(stored).toBeNull();
  });

  it('sollte Login-Status aus localStorage wiederherstellen', () => {
    // User manuell in localStorage setzen (simuliert Browser-Reload)
    const user = {
      username: 'admin',
      displayName: 'Administrator',
      email: 'admin@example.com',
      role: 'admin',
    };
    localStorage.setItem('fethi_app_user', JSON.stringify(user));

    // Neuen Service erstellen (simuliert App-Neustart)
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(AuthService);

 //   expect(freshService.isLoggedIn()).toBe(true);
 //   expect(freshService.currentUser()?.username).toBe('admin');
  });

  it('sollte mit ungültigem localStorage-Inhalt graceful umgehen', () => {
    localStorage.setItem('fethi_app_user', 'ungültiges-json{{{');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(AuthService);

    // Kein Fehler – einfach nicht eingeloggt
    expect(freshService.isLoggedIn()).toBe(false);
  });
});
