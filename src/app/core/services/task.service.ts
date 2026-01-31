import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';
import { catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  tasks = signal<Task[]>([]);

  fetchTasks(userId: string) {
    this.http.get<Task[]>(`${this.apiUrl}/tasks/${userId}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching tasks', error);
          return of([]);
        })
      )
      .subscribe(tasks => this.tasks.set(tasks));
  }

  addTask(task: Partial<Task>) {
    this.http
      .post<Task>(`${environment.apiUrl}/tasks`, task)
      .subscribe((newT) => this.tasks.update((prev) => [newT, ...prev]));
  }

  deleteTask(id: string) {
    this.http.delete(`${environment.apiUrl}/tasks/${id}`).subscribe(() => {
      this.tasks.update((prev) => prev.filter((t) => t.id !== id));
    });
  }

  updateTask(taskId: string, updates: Partial<Task>) {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${taskId}`, updates).pipe(
      tap(() => {
        this.tasks.update((tasks) =>
          tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
        );
      }),
    );
  }

  toggleTask(task: Task) {
    return this.updateTask(task.id!, { completed: !task.completed });
  }
}
