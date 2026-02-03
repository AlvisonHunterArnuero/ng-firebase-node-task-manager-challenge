import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { tap, catchError, throwError } from 'rxjs';
import { CustomSnackbarComponent } from '../../features/notification/custom-snackbar.component';

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

  private titleFirebasePlanLimitation = 'Firebase Plan Limitation (Demo)';
  private disclaimerBlazePlan = `
This demo is running on Firebase’s Spark (free) plan.
Cloud Functions are fully implemented but require the Blaze plan to execute in a live environment.
To review the complete authentication flow, please run the Firebase Emulators locally.
The paid plan upgrade was intentionally avoided for this technical challenge.
    `;

  private showPlanWarning(title?: string, message?: string, duration = 10000) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: {
        title: title || this.titleFirebasePlanLimitation,
        message: message || this.disclaimerBlazePlan.trim(),
      },
      duration: duration,
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
          this.showPlanWarning(
            this.titleFirebasePlanLimitation,
            this.disclaimerBlazePlan.trim(),
          );
        } else {
          this.showPlanWarning('Unexpected error while checking user.');
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
          this.showPlanWarning(
            this.titleFirebasePlanLimitation,
            this.disclaimerBlazePlan.trim(),
          );
        } else if (error.status === 409) {
          this.showPlanWarning('Email already registered.');
        } else {
          this.showPlanWarning(`Registration failed.`);
        }

        return throwError(() => error);
      }),
    );
  }

  logout() {
    this.currentUser.set(null);
  }
}
