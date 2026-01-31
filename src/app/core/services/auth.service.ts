import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly STORAGE_KEY = 'atom_task_user';

  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    });
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  checkUser(email: string) {
    return this.http
      .get<User>(`${this.apiUrl}/users/${email}`)
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  register(email: string) {
    return this.http
      .post<User>(`${this.apiUrl}/users`, { email })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout() {
    this.currentUser.set(null);
  }
}
