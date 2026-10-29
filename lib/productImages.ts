// Product photos live in public/products and are matched by name keywords.
// shortcut: name matching only covers the seeded catalog; upgrade to a
// products.image_url column when admins need to upload their own photos.
const IMAGES: Array<[RegExp, string]> = [
  [/laptop|notebook/, "/products/laptop.jpg"],
  [/mouse/, "/products/mouse.jpg"],
  [/keyboard/, "/products/keyboard.jpg"],
  [/kemeja|flannel|shirt/, "/products/kemeja.jpg"],
  [/celana|jeans/, "/products/celana.jpg"],
  [/indomie|noodle|mie/, "/products/indomie.jpg"],
  [/kopi|coffee/, "/products/kopi.jpg"],
  [/buku|book|python/, "/products/buku.jpg"],
  [/nasi|rice/, "/products/nasi.jpg"],
];

export function getProductImage(name: string): string {
  const lower = name.toLowerCase();
  return IMAGES.find(([pattern]) => pattern.test(lower))?.[1] ?? "/products/placeholder.svg";
}
