import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  const authServiceMock = {
    currentUser: jasmine.createSpy('currentUser').and.returnValue({ id: '123', email: 'test@test.com' }),
    logout: jasmine.createSpy('logout')
  };

  const taskServiceMock = {
    fetchTasks: jasmine.createSpy('fetchTasks'),
    tasks: jasmine.createSpy('tasks').and.returnValue([]),
    addTask: jasmine.createSpy('addTask'),
    updateTask: jasmine.createSpy('updateTask').and.returnValue(of({}))
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create correctly', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch tasks if a user exists', () => {
    expect(authServiceMock.currentUser).toHaveBeenCalled();
    expect(taskServiceMock.fetchTasks).toHaveBeenCalledWith('123');
  });

  it('should invalidate the form if the title is empty', () => {
    component.taskForm.controls['title'].setValue('');
    expect(component.taskForm.invalid).toBeTrue();
  });

  it('should call the logout service and navigate to login', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call updateTask when toggled', () => {
    const mockTask = { id: '1', title: 'Test', completed: false, userId: '123' };
    component.onToggle(mockTask);
    expect(taskServiceMock.updateTask).toHaveBeenCalledWith('1', { completed: true });
  });
});