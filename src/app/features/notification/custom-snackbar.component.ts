import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    selector: 'warning-snackbar',
    template: `
    <div class="flex gap-3 items-start">
      <div class="mt-1 text-orange-500">
        ⚠️
      </div>

      <div class="flex-1">
        <h3 class="font-semibold text-sm mb-1">
          {{ data.title }}
        </h3>

        <p class="text-xs opacity-90 leading-relaxed">
          {{ data.message }}
        </p>
      </div>

      <button
        class="text-xs font-medium opacity-70 hover:opacity-100"
        (click)="snackBarRef.dismiss()"
      >
        Dismiss
      </button>
    </div>
  `,
})
export class CustomSnackbarComponent {
    constructor(
        public snackBarRef: MatSnackBarRef<CustomSnackbarComponent>,
        @Inject(MAT_SNACK_BAR_DATA)
        public data: { title: string; message: string }
    ) { }
}
