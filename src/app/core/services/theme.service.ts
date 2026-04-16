import { DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';


const STORAGE_KEY = 'fethi_dark_mode';
const DARK_CLASS = 'dark-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
   private readonly doc = inject(DOCUMENT);

  readonly isDarkMode = signal<boolean>(this.readInitialValue());

  constructor() {
    effect(() => {
      this.applyClass(this.isDarkMode());
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode.update((v) => !v);
  }

  private readInitialValue(): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return stored === 'true';
    } catch {
      
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  private applyClass(dark: boolean): void {
    const html = this.doc.documentElement;
    html.classList.toggle(DARK_CLASS, dark);
    try {
      localStorage.setItem(STORAGE_KEY, String(dark));
    } catch {
      
    }
  }
  
}
