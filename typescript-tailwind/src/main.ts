// ============================================================
// Product catalog app logic (fully typed).
// - Renders the typed product list into Tailwind-styled cards
// - Live search filters the list as you type
// - An add-to-cart counter is an interactive state update
// Conditional Tailwind classes are derived from the union-typed
// `status` field (typed data -> class strings).
// ============================================================
import { products } from "./products.js";
import type { Product, StockStatus, CartItem } from "./types.js";

// ---- App state ----
let searchTerm = "";
const cart: CartItem[] = []; // array of nested objects

// ---- DOM references (typed) ----
const grid = document.querySelector<HTMLDivElement>("#product-grid")!;
const searchInput = document.querySelector<HTMLInputElement>("#search")!;
const emptyState = document.querySelector<HTMLParagraphElement>("#empty-state")!;
const cartCountEl = document.querySelector<HTMLSpanElement>("#cart-count")!;

// ---- Helpers ----
const formatPrice = (price: number): string =>
  "Rp " + price.toLocaleString("id-ID");

// Map the union-typed status to a Tailwind badge class string.
function statusBadgeClasses(status: StockStatus): string {
  const base =
    "inline-block rounded-full px-2 py-0.5 text-xs font-semibold";
  switch (status) {
    case "in-stock":
      return `${base} bg-green-100 text-green-700`;
    case "low-stock":
      return `${base} bg-amber-100 text-amber-700`;
    case "out-of-stock":
      return `${base} bg-red-100 text-red-700`;
  }
}

function statusLabel(status: StockStatus): string {
  switch (status) {
    case "in-stock":
      return "In stock";
    case "low-stock":
      return "Low stock";
    case "out-of-stock":
      return "Out of stock";
  }
}

// Total quantity across the cart (reduce over an array of typed objects).
function cartTotalQuantity(): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(product: Product): void {
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }
  cartCountEl.textContent = String(cartTotalQuantity());
}

// Build a single Tailwind-styled card element for a typed product.
function createCard(product: Product): HTMLElement {
  const card = document.createElement("article");
  card.className =
    "flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md";

  const disabled = product.status === "out-of-stock";

  card.innerHTML = `
    <div class="h-32 w-full rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100"></div>
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-base font-semibold text-gray-900">${product.name}</h3>
      <span class="${statusBadgeClasses(product.status)}">${statusLabel(
    product.status
  )}</span>
    </div>
    <p class="text-sm text-gray-500 capitalize">${product.category} &bull; &#9733; ${product.rating.toFixed(
    1
  )}</p>
    <div class="flex flex-wrap gap-1">
      ${product.tags
        .map(
          (tag) =>
            `<span class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">#${tag}</span>`
        )
        .join("")}
    </div>
    <p class="mt-auto text-lg font-bold text-blue-600">${formatPrice(
      product.price
    )}</p>
    <button
      type="button"
      class="rounded-lg px-3 py-2 text-sm font-semibold text-white transition ${
        disabled
          ? "cursor-not-allowed bg-gray-300"
          : "bg-blue-600 hover:bg-blue-700"
      }"
      ${disabled ? "disabled" : ""}
    >
      ${disabled ? "Unavailable" : "Add to cart"}
    </button>
  `;

  // Attach the interactive state update (add-to-cart counter).
  const button = card.querySelector<HTMLButtonElement>("button")!;
  if (!disabled) {
    button.addEventListener("click", () => addToCart(product));
  }

  return card;
}

// Render the (filtered) product list.
function render(): void {
  const term = searchTerm.trim().toLowerCase();

  // Live search: filter by name OR any tag.
  const visible = products.filter((product) => {
    if (!term) return true;
    const inName = product.name.toLowerCase().includes(term);
    const inTags = product.tags.some((tag) =>
      tag.toLowerCase().includes(term)
    );
    return inName || inTags;
  });

  grid.innerHTML = "";
  visible.forEach((product) => grid.appendChild(createCard(product)));

  emptyState.classList.toggle("hidden", visible.length > 0);
}

// ---- Wire up live search ----
searchInput.addEventListener("input", (event) => {
  searchTerm = (event.target as HTMLInputElement).value;
  render();
});

// Initial paint
render();
