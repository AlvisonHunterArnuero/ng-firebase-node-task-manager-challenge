import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  public taskService = inject(TaskService);
  public auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
  });

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) {
      this.taskService.fetchTasks(user.id);
    }
  }

  addTask() {
    if (this.taskForm.invalid) return;

    this.taskService.addTask({
      ...this.taskForm.value,
      userId: this.auth.currentUser()!.id,
    } as any);

    this.taskForm.reset();
  }

  onToggle(task: Task) {
    this.taskService.updateTask(task.id!, { completed: !task.completed }).subscribe({
      next: () => console.log('Persisted in Firebase'),
      error: (err) => console.error('Persistence error', err)
    });
  }

  editTask(task: Task) {
    const newTitle = prompt('Edit task:', task.title);
    if (newTitle && newTitle.trim() !== '') {
      this.taskService.updateTask(task.id!, { title: newTitle }).subscribe();
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}