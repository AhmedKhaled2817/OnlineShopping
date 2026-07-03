# OnlineShopping

A modern Angular-based e-commerce storefront built with Angular 21 and PrimeNG. The app includes a shopping home page, product catalog, category browsing, deals, contact page, wishlist, cart flow, and secure profile access.

## Project structure

- `src/app/home` - homepage and featured product cards
- `src/app/shop` - shop listing, product details, filters, and pagination
- `src/app/categories`, `src/app/deals`, `src/app/pages`, `src/app/contact` - standalone content pages
- `src/app/core` - reusable services, guards, pipes, and shared state
- `src/app/features/wishlist` - wishlist page and favorite handling
- `src/app/navbar`, `src/app/sidebar`, `src/app/layout` - navigation, sidebar, and responsive UI components

## Key features

- Standalone Angular components with route-based navigation
- Favorites / wishlist management persisted in `localStorage`
- Authentication guard for protected profile access
- Responsive UI with PrimeNG components
- Search, category filtering, and pagination for product browsing
- Vercel-compatible build configuration

## Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended
- Angular CLI installed globally if using `ng` commands directly

## Install dependencies

```bash
npm install
```

## Run locally

```bash
npm start
```

Then open `http://localhost:4200/`.

## Build for production

```bash
npm run build
```

## Notes for deployment

- Ensure `package.json` and `package-lock.json` are both committed
- Remove unsupported packages on Linux hosts, such as `cursor-reset-tool`
- Deploy with Vercel or any static hosting provider that supports Angular builds

## Useful commands

- `npm start` - start dev server
- `npm run build` - production build
- `npm test` - run unit tests
- `npx ng lint` - lint project (if configured)

## Troubleshooting

If Vercel install fails due to unsupported platform packages, remove the offending dependency from `package.json` and reinstall.
