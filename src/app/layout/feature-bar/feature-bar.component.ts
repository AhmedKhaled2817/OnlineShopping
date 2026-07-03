import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-feature-bar',
  templateUrl: './feature-bar.component.html',
  styleUrls: ['./feature-bar.component.css'],
})
export class FeatureBarComponent {
  readonly features = [
    { icon: 'fa-truck-fast', title: 'Free Shipping', text: 'On orders over $50' },
    { icon: 'fa-arrow-rotate-left', title: 'Easy Returns', text: '30 days money back' },
    { icon: 'fa-shield-halved', title: 'Secure Payment', text: '100% secure checkout' },
    { icon: 'fa-headset', title: '24/7 Support', text: 'Dedicated customer care' },
  ];
}
