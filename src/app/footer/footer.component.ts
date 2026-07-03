import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafeUrlPipe } from '../core/pipes/safe-url.pipe';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, SafeUrlPipe],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly mapUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1947.6617190770357!2d44.81646062846492!3d41.78199108693887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sge!4v1751038694296!5m2!1sen!2sge';
}
