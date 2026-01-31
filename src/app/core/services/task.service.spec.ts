import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created correctly', () => {
    expect(service).toBeTruthy();
  });

  it('should load tasks and update the tasks signal', () => {
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', completed: false, userId: 'user123' }
    ];

    service.fetchTasks('user123');

    const req = httpMock.expectOne(request =>
      request.url.includes('/tasks') && request.url.includes('user123')
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);

    expect(service.tasks()).toEqual(mockTasks);
  });

  it('should handle errors when loading tasks and leave the signal empty', (done: DoneFn) => {
    service.fetchTasks('user123');

    const req = httpMock.expectOne(request =>
      request.url.includes('/tasks') && request.url.includes('user123')
    );

    req.flush('Server Error', {
      status: 500,
      statusText: 'Server Error'
    });

    setTimeout(() => {
      expect(service.tasks().length).toBe(0);
      done();
    }, 0);
  });
});