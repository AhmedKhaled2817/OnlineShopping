import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { apiHeadsInterceptor } from './api-heads.interceptor';
import { provideShoppingPrimeNG } from '../theme/prime-theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiHeadsInterceptor])),
    provideShoppingPrimeNG(),
    MessageService,
  ],
};
