import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';

const ShoppingMallPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#fbf8eb',
      100: '#f5ecc7',
      200: '#ebd88f',
      300: '#e0c45a',
      400: '#d4af37',
      500: '#d4af37',
      600: '#b8962e',
      700: '#9a7d26',
      800: '#7c641f',
      900: '#5e4b17',
      950: '#3f3210',
    },
  },
});

export const provideShoppingPrimeNG = () =>
  providePrimeNG({
    theme: {
      preset: ShoppingMallPreset,
      options: {
        darkModeSelector: '.app-dark',
        cssLayer: false,
      },
    },
    ripple: true,
  });
