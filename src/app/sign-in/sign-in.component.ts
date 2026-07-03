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
import { ApiAreaService } from '../services/api-area.service';
import { ToolsService } from '../services/tools.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-in',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  @Output() closeEmit = new EventEmitter<boolean>();
  @Output() changeEmit = new EventEmitter<boolean>();
  @Output() loggedEmit = new EventEmitter<boolean>();

  hidePassword = true;
  isSubmitting = false;
  errorSMS: string | undefined;
  errAlert = false;
  successLogin = false;

  protected signInForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private api: ApiAreaService,
    public _cookie: CookieService,
    private tools: ToolsService
  ) {}

  signIn(): void {
    if (this.signInForm.invalid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.errAlert = false;

    this.api.signIn(this.signInForm.value).subscribe({
      next: (data: any) => {
        this._cookie.set('user', data.access_token, 1);
        this.successLogin = true;
        this.api.profileInfo().subscribe((profile: any) => {
          const userInfo = {
            firstName: profile.firstName,
            avatar: profile.avatar,
          };
          this.tools.userNavbarInfo.next(userInfo);
          this._cookie.set('userInfo', JSON.stringify(userInfo), 1);
        });
        setTimeout(() => {
          this.isSubmitting = false;
          this.closeEmit.emit(false);
          this.loggedEmit.emit(true);
        }, 900);
      },
      error: (err: { error?: { error?: string } }) => {
        this.errorSMS = err.error?.error ?? 'Sign in failed. Please try again.';
        this.errAlert = true;
        this.isSubmitting = false;
      },
    });
  }

  closeForm(): void {
    this.closeEmit.emit(false);
  }

  outSide(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('auth-overlay')) {
      this.closeEmit.emit(false);
    }
  }

  change(): void {
    this.changeEmit.emit(true);
  }
}
