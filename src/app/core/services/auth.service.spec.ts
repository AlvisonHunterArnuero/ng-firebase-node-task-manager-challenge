import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, User } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created correctly', () => {
    expect(service).toBeTruthy();
  });

  it('should get the user and update the currentUser Signal', () => {
    const mockUser: User = { id: '123', email: 'test@example.com' };
    const email = 'test@example.com';

    service.checkUser(email).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.currentUser()).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should clear the currentUser Signal on logout', () => {
    service.currentUser.set({ id: '123', email: 'test@example.com' });

    service.logout();

    expect(service.currentUser()).toBeNull();
  });
});