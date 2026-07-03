import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-mobile-nav',
  imports: [RouterModule],
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.css'],
})
export class MobileNavComponent {
  readonly links = [
    { path: '/', label: 'Home', icon: 'fa-house', exact: true },
    { path: '/shop', label: 'Categories', icon: 'fa-grid-2', exact: false },
    { path: '/cart', label: 'Cart', icon: 'fa-cart-shopping', exact: false },
    { path: '/wishlist', label: 'Wishlist', icon: 'fa-heart', exact: false },
    { path: '/profile', label: 'Profile', icon: 'fa-user', exact: false },
  ];
}
