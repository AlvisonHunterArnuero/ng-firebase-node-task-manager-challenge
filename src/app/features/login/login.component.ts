import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserCreationDialogComponent } from './user-creation-dialog/user-creation-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  template: `
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950 font-sans transition-colors duration-300">
    <div class="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border dark:border-gray-800">
      <h1 class="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">Task Manager</h1>
      <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
        <input type="email" formControlName="email" placeholder="Enter your email"
               class="w-full p-3 border dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
        <button type="submit" [disabled]="loginForm.invalid"
                class="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors
                       disabled:bg-gray-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-500 disabled:cursor-not-allowed">
          Login
        </button>
      </form>
    </div>
  </div>
`
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onLogin() {
    const email = this.loginForm.value.email!;
    this.auth.checkUser(email).subscribe({
      next: (user) => {
        this.auth.currentUser.set(user);
        this.router.navigate(['/tasks']);
      },
      error: () => this.showCreateUserDialog(email)
    });
  }

  private showCreateUserDialog(email: string) {
    const dialogRef = this.dialog.open(UserCreationDialogComponent, {
      data: { email }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.auth.register(email).subscribe({
          next: (newUser) => {
            this.auth.currentUser.set(newUser);
            this.router.navigate(['/tasks']);
          },
          error: (err) => console.error('Registration error:', err)
        });
      }
    });
  }
}