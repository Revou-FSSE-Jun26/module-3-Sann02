// ============================================================
// JS Exercise 2 — Array processing with forEach/map/filter/reduce
// The data is an array of product objects (all five data types:
// string, number, boolean, array, object). We iterate, transform,
// and aggregate it, printing results to the page and the console.
// ============================================================

const products = [
  { name: "Laptop", price: 15000000, inStock: true, tags: ["electronics"] },
  { name: "Wireless Mouse", price: 250000, inStock: true, tags: ["accessory"] },
  { name: "Mechanical Keyboard", price: 750000, inStock: false, tags: ["accessory"] },
  { name: "USB-C Hub", price: 350000, inStock: true, tags: ["accessory"] },
  { name: "4K Monitor", price: 4200000, inStock: false, tags: ["electronics"] },
  { name: "Laptop Stand", price: 180000, inStock: true, tags: ["accessory"] },
];

// Helper — format a number as Rupiah (numbers stay numbers until display)
const formatPrice = (n) => "Rp " + n.toLocaleString("id-ID");

// Small helper to render text into a <pre> and also log it
function render(id, lines) {
  const text = Array.isArray(lines) ? lines.join("\n") : String(lines);
  document.querySelector(id).textContent = text;
  console.log(`--- ${id} ---\n${text}`);
}

// ---- forEach: run a side effect for each item (build a list) ----
const forEachLines = [];
products.forEach((product, index) => {
  forEachLines.push(
    `${index + 1}. ${product.name} — ${formatPrice(product.price)} (${
      product.inStock ? "in stock" : "out of stock"
    })`
  );
});
render("#out-foreach", forEachLines);

// ---- map: transform each item into a new shape ----
const labels = products.map(
  (product) => `${product.name}: ${formatPrice(product.price)}`
);
render("#out-map", labels);

// ---- filter: keep only items matching a condition ----
const affordableInStock = products.filter(
  (product) => product.inStock && product.price < 1000000
);
render(
  "#out-filter",
  affordableInStock.map((p) => `${p.name} — ${formatPrice(p.price)}`)
);

// ---- reduce: aggregate the array into a single value ----
const inStockTotal = products.reduce((sum, product) => {
  return product.inStock ? sum + product.price : sum;
}, 0);
render(
  "#out-reduce",
  `Total in-stock inventory value: ${formatPrice(inStockTotal)}`
);
