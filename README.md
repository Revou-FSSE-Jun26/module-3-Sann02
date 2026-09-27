# RevoShop — Frontend Fundamentals (Checkpoint 1)

Author: **M Ikhsan Febrian**

This repository proves fluency in the raw building blocks that React, Next.js,
and Tailwind sit on top of: **semantic HTML**, **CSS layout** (Grid / Flexbox +
responsive breakpoints), **vanilla JavaScript** (DOM manipulation, events, array
methods), **TypeScript's type system**, and **Tailwind's utility-first styling**.

> This checkpoint is fundamentals-focused and does **not** touch Next.js or the
> Flask API — those start in Checkpoint 2. The typed product catalog here is the
> direct predecessor of the React `ProductCard` you'll build next.

---

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
