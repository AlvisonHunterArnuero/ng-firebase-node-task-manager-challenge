import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const dialogMock = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(true)
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: MatDialog, useValue: dialogMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created correctly', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
  });

  it('should mark the form as invalid if the email is incorrect', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();
  });
});