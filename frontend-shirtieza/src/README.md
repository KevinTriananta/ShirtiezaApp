## Frontend Structure

This frontend uses a small clean architecture layout:

- `app/` contains application shell code: providers, layouts, and routes.
- `pages/` contains route-level screens only. Pages compose features and shared modules.
- `features/` contains domain UI and hooks, grouped by feature such as `home`, `products`, `cart`, and `admin`.
- `shared/` contains reusable modules with no feature ownership: API clients, config, hooks, types, and UI primitives.
- `assets/` contains static assets imported by the app.

Import rules:

- Use aliases instead of long relative paths: `@app`, `@features`, `@shared`, `@pages`, `@assets`.
- Keep feature-specific modules inside their feature folder.
- Put reusable UI primitives in `shared/ui`.
- Put API adapters in `shared/api` and shared axios setup in `shared/lib`.
- Avoid importing from another feature unless that module is intentionally shared by the product domain.
