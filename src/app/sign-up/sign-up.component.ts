import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { ApiAreaService } from '../services/api-area.service';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  @Output() closeEmit = new EventEmitter<boolean>();

  isSubmitting = false;
  successRegister = false;
  errorList: string[] = [];

  protected signUpForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(7)]),
    address: new FormControl('', Validators.required),
    phone: new FormControl('+995', [Validators.required, Validators.minLength(9)]),
    zipcode: new FormControl('', Validators.required),
    avatar: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
  });

  constructor(private service: ApiAreaService) {}

  signUp(): void {
    if (this.signUpForm.invalid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.errorList = [];

    this.service.register(this.signUpForm.value).subscribe({
      next: () => {
        this.successRegister = true;
        setTimeout(() => {
          this.isSubmitting = false;
          this.closeEmit.emit(false);
        }, 900);
      },
      error: (err: { error?: { errorKeys?: string[] } }) => {
        this.errorList = err.error?.errorKeys ?? ['Registration failed. Please try again.'];
        this.isSubmitting = false;
      },
    });
  }

  closeForm(): void {
    this.closeEmit.emit(false);
  }

  everyWhere(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('auth-overlay')) {
      this.closeEmit.emit(false);
    }
  }
}
