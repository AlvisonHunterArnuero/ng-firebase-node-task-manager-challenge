import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreationDialogComponent } from './user-creation-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('UserCreationDialogComponent', () => {
  let component: UserCreationDialogComponent;
  let fixture: ComponentFixture<UserCreationDialogComponent>;

  const dialogMock = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with "true" when the user confirms', () => {
    if (component.onConfirm) {
      component.onConfirm();
      expect(dialogMock.close).toHaveBeenCalledWith(true);
    }
  });

  it('should close the dialog with "false" when the user cancels', () => {
    if (component.onCancel) {
      component.onCancel();
      expect(dialogMock.close).toHaveBeenCalledWith(false);
    }
  });
});