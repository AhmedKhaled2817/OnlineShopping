import { Component, OnInit } from '@angular/core';
import { SignInComponent } from '../sign-in/sign-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { Router, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { ToolsService } from '../services/tools.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  imports: [
    SignInComponent,
    SignUpComponent,
    RouterModule,
    Button,
    IconField,
    InputIcon,
    InputText,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public mobileMenuOpen = false;

  constructor(
    private _cookie: CookieService,
    private tools: ToolsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const cookieUserInfo = this._cookie.get('userInfo');
    if (cookieUserInfo) {
      const parsed = this.parseUserInfo(cookieUserInfo);
      this.isLoggedIn = !!parsed;
      this.userImg = parsed?.avatar;
      this.userName = parsed?.firstName;
    } else {
      this.isLoggedIn = false;
    }

    this.tools.isSignedIn.subscribe((info: boolean) => {
      this.isSignShow = info;
    });
    this.tools.isRegistered.subscribe((info: boolean) => {
      this.isRegisterShow = info;
    });

    this.profileInfoNav();
  }

  public isSignShow: boolean = false;
  public isRegisterShow: boolean = false;
  public isLoggedIn: any;
  public userImg: any;
  public userName: any;
  public user: any;

  signInForm() {
    this.tools.isSignedIn.next(true);
  }

  signOut() {
    this._cookie.deleteAll();
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.userImg = undefined;
    this.userName = undefined;
    this.tools.userNavbarInfo.next(null);
  }
  showRegister() {
    this.tools.isSignedIn.next(false);
    this.tools.isRegistered.next(true);
  }

  closeForm(close: boolean) {
    this.isSignShow = close;
  }

  closeRegister(close: boolean) {
    this.isRegisterShow = close;
  }

  loggedIn(logg: boolean) {
    this.isLoggedIn = logg;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  onSearchValue(value: string): void {
    const query = value?.trim();
    if (!query) {
      return;
    }
    this.tools.homeSearchQuery.next(query);
    this.router.navigate(['/shop']);
    this.mobileMenuOpen = false;
  }

  profileInfoNav() {
    this.tools.userNavbarInfo.subscribe((data: any) => {
      setTimeout(() => {
        const cookieUserInfo = this.parseUserInfo(this._cookie.get('userInfo'));
        if (data?.avatar || cookieUserInfo) {
          this.isLoggedIn = true;
          this.userImg = data?.avatar || cookieUserInfo?.avatar;
          this.userName = data?.firstName || cookieUserInfo?.firstName;
        } else {
          this.isLoggedIn = false;
        }
      }, 0);
    });
  }

  private parseUserInfo(value: string): { firstName?: string; avatar?: string } | null {
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      this._cookie.delete('userInfo');
      return null;
    }
  }
}
