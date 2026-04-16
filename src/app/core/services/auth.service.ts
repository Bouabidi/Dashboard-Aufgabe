import { computed, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';



const STORAGE_KEY = 'dashboard_app_user';

const MOCK_USERS: { username: string; password: string; user: User }[] = [
  {
    username: 'admin',
    password: 'admin123',
    user: {
      username: 'admin',
      displayName: 'Administrator',
      email: 'admin@example.com',
      role: 'admin',
    },
  },
  {
    username: 'user',
    password: 'user123',
    user: {
      username: 'user',
      displayName: 'Max Mustermann',
      email: 'max@example.com',
      role: 'user',
    },
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly _currentUser = signal<User | null>(this.loadFromStorage());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  login(username: string, password: string): boolean {
    const match = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (match) {
      this._currentUser.set(match.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match.user));
      return true;
    }
    return false;
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  private loadFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
  
}
