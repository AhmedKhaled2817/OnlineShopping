import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { MobileNavComponent } from './layout/mobile-nav/mobile-nav.component';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [RouterModule, NavbarComponent, FooterComponent, MobileNavComponent, Toast],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'onlineShopping';
}
