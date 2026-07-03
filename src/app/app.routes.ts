import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CartComponent } from './cart/cart.component';
import { ShopComponent } from './shop/shop.component';
import { DetailsComponent } from './shop/details/details.component';
import { CategoriesComponent } from './categories/categories.component';
import { DealsComponent } from './deals/deals.component';
import { PagesComponent } from './pages/pages.component';
import { ContactComponent } from './contact/contact.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Home | Shopping Mall' },
    { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard], title: 'Profile | Shopping Mall' },
    { path: 'cart', component: CartComponent, title: 'Cart | Shopping Mall' },
    { path: 'shop', component: ShopComponent, title: 'Shop | Shopping Mall' },
    { path: 'categories', component: CategoriesComponent, title: 'Categories | Shopping Mall' },
    { path: 'deals', component: DealsComponent, title: 'Deals | Shopping Mall' },
    { path: 'pages', component: PagesComponent, title: 'Company Pages | Shopping Mall' },
    { path: 'contact', component: ContactComponent, title: 'Contact | Shopping Mall' },
    { path: 'wishlist', component: WishlistComponent, title: 'Wishlist | Shopping Mall' },
    { path: 'details/:id', component: DetailsComponent, title: 'Product Details | Shopping Mall' },
    { path: '**', component: NotFoundComponent, title: '404 | Shopping Mall' },
];
