# RevoShop Frontend

Author: **M Ikhsan Febrian**

| Checkpoint | What | Where |
| --- | --- | --- |
| **2** | Next.js 16 App Router frontend with live data from the Module 2 Flask API | repo root (`app/`, `components/`, `lib/`) |
| **1** | HTML/CSS, vanilla JS, TypeScript + Tailwind fundamentals | `html-css/`, `javascript/`, `typescript-tailwind/` ([details below](#checkpoint-1--frontend-fundamentals)) |

---

# Checkpoint 2: Next.js + Flask API

Scaffolded with `create-next-app` (TypeScript, ESLint, Tailwind CSS v4, App Router).
Every page fetches **real data** from the RevoShop Flask API in a **Server Component**.

## ▶️ Run it locally

**1. Start the Flask API (Module 2)** at `http://localhost:5000`, using PostgreSQL:

```bash
cd revoshop-backend
uv sync                      # or: pip install -r requirements.txt
uv run flask db upgrade
uv run python -m helper.seed
uv run python -m helper.seed_order
uv run flask run --port 5000
```

> `GET /products` accepts optional `?search=` (case-insensitive name match) and
> `?category_id=`. Both were added to the Module 2 API for this checkpoint and
> are covered by tests in `tests/test_products.py`.

**2. Start the Next.js app** from the repo root:

```bash
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm install
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build / serve. The API must be running, because pages render at request time |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |

### Environment variables (`.env.example`)

| Key | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Flask API base URL. Every fetch reads this; there are no hardcoded URLs |
| `API_SECRET_KEY` | Server-only secret (no `NEXT_PUBLIC_` prefix). Sent as `X-API-Key` when set |
| `API_DEMO_DELAY_MS` | Optional artificial delay to make `loading.tsx` easy to see (default `0`) |

`.env.local` is git-ignored (`.env*`). Only `.env.example` is committed (`!.env.example`).

## 📁 Structure

```
app/
├── layout.tsx              Root layout: <Header /> + page + <Footer /> on every route, title template
├── page.tsx                /             first 5 products (read-only cards)
├── loading.tsx, error.tsx, not-found.tsx
├── products/
│   ├── layout.tsx          Nested layout (banner + breadcrumb), stays mounted
│   ├── page.tsx            /products     renders only <ProductGrid />
│   ├── loading.tsx, error.tsx
│   └── [id]/
│       ├── page.tsx        /products/:id detail + generateMetadata (product name as title)
│       └── loading.tsx, error.tsx
├── categories/             /categories   page.tsx + loading.tsx + error.tsx
└── orders/                 /orders       page.tsx + loading.tsx + error.tsx
components/                 Header, NavBar, Footer, Card, Badge, ProductCard, QuantityCounter,
                            ProductGrid, SearchBar, CategoryFilter, AddProductForm, CartSummary,
                            RouteError, Skeletons, LayoutMountLogger
lib/
├── types.ts                Product / Category / Order types that mirror the Flask JSON
├── api.ts                  Server-only fetch helpers (res.ok check → throws for error.tsx)
└── utils.ts                cn(), formatPrice(), stock + status → Tailwind class helpers
```

## 🧭 How the pieces fit

- **Server vs Client.** Pages are Server Components that `await` the API. Client Components
  are used only for interactivity: `NavBar` (`usePathname`), `ProductGrid` (search, filter,
  cart, form), `ProductCard` (quantity counter), and the `error.tsx` boundaries.
- **Search + category filter.**
  - Typing filters the list instantly in the browser.
  - After a short pause, `router.push()` writes `?search=` / `?category=` to the URL.
  - The `/products` Server Component then refetches `GET /products?search=&category_id=` from
    the API. Back/forward and shared links keep the same filters.
- **Cart.** The cart is held in `ProductGrid` state and updated immutably (`[...prev, item]`,
  `map`, `filter`). The summary's item count and total are derived from it, not stored.
- **AddProductForm.** Controlled inputs with `validate()` on every render. Errors appear inline,
  and the submit button stays disabled until the form is valid. New products are appended to
  local state; saving to the API is Checkpoint 3.
- **Errors.** `lib/api.ts` checks `res.ok` and throws. Each route's `error.tsx` shows a friendly
  message and a **Try again** button (`retry()`).
- **Nested layout.** Open DevTools → Console and click between `/products` and `/products/[id]`.
  `[products/layout] mounted` is logged once. `unmounted` appears only after you leave the
  products section.

## 🎬 Demo evidence (`screenshots/checkpoint-2/`)

| File | Shows |
| --- | --- |
| `01-home-5-products.png` | Home with 5 real products from the API, Home active in the nav |
| `02-products-search-and-category.png` | Live search "celana" + category "Pakaian" at `/products?search=celana&category=2` |
| `03-products-cart-and-form.png` | Cart count/total after Add to Cart, product added via the form, out-of-stock card |
| `04-product-detail-dynamic-title.png` | `/products/2` with title "Mouse Logitech G502 \| RevoShop" |
| `05-categories.png`, `06-orders.png` | Real categories (with product counts) and recent orders |
| `07-products-mobile.png` | Mobile width (375px) |
| `08-loading-skeleton.png` | `loading.tsx` skeleton (captured with `API_DEMO_DELAY_MS=3000`) |
| `09-error-api-offline.png` | `error.tsx` with the Flask API stopped |

To reproduce:
- **Loading state:** set `API_DEMO_DELAY_MS=3000` in `.env.local` and restart `npm run dev`.
- **Error state:** stop the Flask server and reload a page.

---

# Checkpoint 1 — Frontend Fundamentals

These exercises cover the building blocks that React, Next.js and Tailwind sit on top of:
semantic HTML, CSS layout, vanilla JavaScript, TypeScript, and Tailwind.

## 📁 Folder structure

```
revoshop-frontend/
├── html-css/              Semantic profile page + contact form
│   ├── index.html         header/main/section/article/footer, full contact form
│   ├── styles.css         all 5 selector types, box model, CSS Grid, responsive
│   └── profile.js         prevents default form submit + status message
│
├── javascript/            Plain JS, runnable directly in the browser
│   ├── dom-events.html     ┐ DOM manipulation + event handling exercise
│   ├── dom-events.js       ┘ select/update, toggle class, create/remove elements
│   ├── array-processing.html ┐ forEach / map / filter / reduce exercise
│   └── array-processing.js   ┘ iterate, transform, aggregate typed array data
│
├── typescript-tailwind/   tsc + tsconfig + Tailwind CSS project
│   ├── package.json        build scripts + dev dependencies
│   ├── tsconfig.json       strict TypeScript config, compiles to dist/
│   ├── index.html          the catalog page (loads compiled JS + built CSS)
│   ├── src/
│   │   ├── types.ts        interfaces, type aliases, union types
│   │   ├── products.ts     the typed product data (array of typed objects)
│   │   ├── main.ts         render + live search + add-to-cart counter
│   │   └── input.css       Tailwind entry (@import "tailwindcss")
│   └── dist/               build output (generated; git-ignored)
│
├── screenshots/           profile (desktop + mobile) + catalog with live search
└── README.md
```

---

## ▶️ How to run each part locally

### 1. `html-css/` — profile page

No build step. Just open the file in a browser:

- Double-click `html-css/index.html`, **or**
- Right-click → *Open with Live Server* in VS Code.

Resize the window across **768px** to see the layout switch from a single
stacked column (mobile) to a two-column grid (content + sidebar) with the header
and footer spanning the full width.

### 2. `javascript/` — the two exercises

No build step. Open either file in a browser and open DevTools (F12) to see the
console output:

- `javascript/dom-events.html` — click the counter, toggle the highlight class,
  add/remove tasks.
- `javascript/array-processing.html` — results of `forEach`, `map`, `filter`,
  and `reduce` are rendered on the page **and** logged to the console.

### 3. `typescript-tailwind/` — typed product catalog

This one compiles TypeScript with `tsc` and builds CSS with the Tailwind CLI.

```bash
cd typescript-tailwind
npm install        # install typescript + @tailwindcss/cli
npm run build      # compiles src/*.ts -> dist/*.js  AND  builds dist/output.css
```

Then open `typescript-tailwind/index.html` in a browser (Live Server
recommended so ES module imports load over http).

Useful scripts:

| Script              | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run build`     | one-shot: compile TS **and** build Tailwind CSS     |
| `npm run build:ts`  | compile TypeScript only (`tsc`)                     |
| `npm run build:css` | build the Tailwind stylesheet only                  |
| `npm run watch:ts`  | recompile TS on change                              |
| `npm run watch:css` | rebuild CSS on change                               |

> **Note:** `dist/` is git-ignored (build artifacts aren't committed). After
> cloning, run `npm install && npm run build` before opening `index.html`.

---

## ✅ What each rubric item maps to

**HTML, CSS & JavaScript fundamentals**

- Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `aside`,
  `footer`) — `html-css/index.html`.
- Contact form with labelled inputs of every type (text, email, number, radio
  group, checkbox, select, textarea, submit) — `html-css/index.html`.
- Box model + all five selector types (element, class, ID, descendant,
  pseudo-class) — `html-css/styles.css`.
- Two-dimensional CSS Grid layout + Flexbox inside a cell — `html-css/styles.css`.
- Responsive `@media (min-width: 768px)` breakpoint (mobile-first) —
  `html-css/styles.css`.
- Variables with correct types, operators, functions — the JS files.
- Select/update DOM, toggle classes, create/remove elements, event handlers with
  `preventDefault` — `javascript/dom-events.js` and `html-css/profile.js`.
- `forEach` / `map` / `filter` / `reduce` — `javascript/array-processing.js`.

**TypeScript & Tailwind CSS**

- `tsc` + configured `tsconfig.json`, compiles without errors —
  `typescript-tailwind/tsconfig.json`.
- Interfaces + type aliases + union types — `src/types.ts`
  (`Product`/`CartItem` interfaces, `Rupiah`/`Catalog` aliases,
  `Category`/`StockStatus` union types).
- Nested objects and arrays typed correctly — `src/products.ts` (an array of
  typed `Product` objects, each with a nested `tags` array).
- Tailwind installed & configured, utility-first classes instead of custom CSS —
  `src/input.css` + `index.html`.
- Typography utilities + mobile-first responsive layout
  (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) — `index.html`.
- Typed data mapped to conditional Tailwind class strings (badge colour derived
  from the union-typed `status` field) — `src/main.ts` (`statusBadgeClasses`).
- Fully typed interactive catalog: renders from data, **live search** filters by
  name/tag, **add-to-cart counter** updates on click — `src/main.ts`.

---

## 📸 Screenshots

See the `screenshots/` folder:

- Profile page at a **desktop** width.
- Profile page at a **mobile** width.
- The typed product catalog showing **live search** and Tailwind styling in
  action.
