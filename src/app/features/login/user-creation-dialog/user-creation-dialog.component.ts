import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-creation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './user-creation-dialog.component.html',
  styleUrl: './user-creation-dialog.component.css'
})
export class UserCreationDialogComponent {
  private dialogRef = inject(MatDialogRef<UserCreationDialogComponent>);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}