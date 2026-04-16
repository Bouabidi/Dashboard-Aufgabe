import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-theme');

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-theme');
  });

  it('sollte erstellt werden', () => {
    expect(service).toBeTruthy();
  });

  it('sollte initial hellen Modus haben (kein localStorage-Eintrag)', () => {
    expect(service.isDarkMode()).toBe(false);
  });

  it('sollte Dark Mode via toggleDarkMode() aktivieren', () => {
    service.toggleDarkMode();

    expect(service.isDarkMode()).toBe(true);
  });

  it('sollte Dark Mode via zweiten Toggle wieder deaktivieren', () => {
    service.toggleDarkMode();
    service.toggleDarkMode();

    expect(service.isDarkMode()).toBe(false);
  });

  it('sollte die Klasse "dark-theme" auf <html> setzen wenn Dark Mode aktiv', () => {
    service.toggleDarkMode();
    TestBed.flushEffects();

    expect(document.documentElement.classList.contains('dark-theme')).toBe(true);
  });

  it('sollte die Klasse "dark-theme" von <html> entfernen wenn Dark Mode deaktiviert', () => {
    service.toggleDarkMode(); // an
    TestBed.flushEffects();
    service.toggleDarkMode(); // aus
    TestBed.flushEffects();

    expect(document.documentElement.classList.contains('dark-theme')).toBe(false);
  });

  it('sollte Dark Mode-Zustand in localStorage speichern', () => {
    service.toggleDarkMode();
    TestBed.flushEffects();

    expect(localStorage.getItem('fethi_dark_mode')).toBe('true');
  });

  it('sollte hellen Zustand in localStorage speichern', () => {
    service.toggleDarkMode(); // dark
    TestBed.flushEffects();
    service.toggleDarkMode(); // light
    TestBed.flushEffects();

    expect(localStorage.getItem('fethi_dark_mode')).toBe('false');
  });

  it('sollte Dark Mode aus localStorage wiederherstellen', () => {
    localStorage.setItem('fethi_dark_mode', 'true');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const freshService = TestBed.inject(ThemeService);

    expect(freshService.isDarkMode()).toBe(true);
  });
});
