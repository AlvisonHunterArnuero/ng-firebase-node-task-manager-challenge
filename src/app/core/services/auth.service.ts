import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { tap, catchError, throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

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

  private disclaimerBlazePlan = `Cloud Functions require Firebase Blaze Plan. Please test Auth functionality locally.`;
  private showWarning(message?: string) {
    this.snackBar.open(message ?? this.disclaimerBlazePlan, 'Dismiss', {
      duration: 9000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['warning-snackbar'],
    });
  }

  checkUser(email: string) {
    return this.http.get<User>(`${this.apiUrl}/users/${email}`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return throwError(() => error);
        }

        if (error.status === 403) {
          this.showWarning();
        } else {
          this.showWarning('Unexpected error while checking user.');
        }

        return throwError(() => error);
      }),
    );
  }

  register(email: string) {
    return this.http.post<User>(`${this.apiUrl}/users`, { email }).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.showWarning();
        } else if (error.status === 409) {
          this.showWarning('Email already registered.');
        } else {
          this.showWarning(
            `Registration failed. ${this.disclaimerBlazePlan}`,
          );
        }

        return throwError(() => error);
      }),
    );
  }

  logout() {
    this.currentUser.set(null);
  }
}
