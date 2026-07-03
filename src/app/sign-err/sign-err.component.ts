import { Component, OnInit } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ToolsService } from '../services/tools.service';

@Component({
  selector: 'app-sign-err',
  imports: [Dialog, Button],
  templateUrl: './sign-err.component.html',
  styleUrls: ['./sign-err.component.css'],
})
export class SignErrComponent implements OnInit {
  isShown = false;

  constructor(private tools: ToolsService) {}

  ngOnInit(): void {
    this.tools.isErrSMS.subscribe((info: boolean) => {
      this.isShown = info;
    });
  }

  closeErr(): void {
    this.tools.isErrSMS.next(false);
  }

  signIn(): void {
    this.tools.isErrSMS.next(false);
    this.tools.isSignedIn.next(true);
  }

  register(): void {
    this.tools.isErrSMS.next(false);
    this.tools.isRegistered.next(true);
  }
}
