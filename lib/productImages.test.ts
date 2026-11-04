import { getPlaceholderImage, getProductImage } from "@/lib/productImages";
import type { Product } from "@/lib/types";

const product = (overrides: Partial<Product>): Product => ({
  id: 1,
  name: "Produk",
  description: "",
  price: 1000,
  stock_quantity: 1,
  category_id: 1,
  image_url: null,
  created_at: "2026-01-01T00:00:00",
  ...overrides,
});

describe("getPlaceholderImage", () => {
  it("picks the specific product type even when the name also mentions laptop", () => {
    expect(getPlaceholderImage("ROBOT M366 Mouse Wireless untuk Laptop PC")).toBe("/products/mouse.jpg");
    expect(getPlaceholderImage("Tas Laptop Semi kulit 14 Inch")).toContain("photo-1553062407");
    expect(getPlaceholderImage("Charger INNERGIE 180W Adaptor Laptop")).toContain("photo-1583863788434");
    expect(getPlaceholderImage("V-GeN RAM SODimm DDR4 Laptop")).toContain("photo-1562976540");
  });

  it("prefers keyboard over the mouse in a combo name", () => {
    expect(getPlaceholderImage("Cougar COMBAT Keyboard + Mouse Gaming Combo")).toBe("/products/keyboard.jpg");
  });

  it("falls back to the laptop photo for laptops", () => {
    expect(getPlaceholderImage("Apple MacBook Neo 13 inch Laptop")).toBe("/products/laptop.jpg");
  });

  it("does not treat a word fragment as a keyword", () => {
    expect(getPlaceholderImage("Buku Python Programming")).toBe("/products/buku.jpg");
  });
});

describe("getProductImage", () => {
  it("keeps the backend image_url when present", () => {
    expect(getProductImage(product({ image_url: "https://example.com/foto.jpg" }))).toBe(
      "https://example.com/foto.jpg",
    );
  });

  it("uses the keyword photo when image_url is missing", () => {
    expect(getProductImage(product({ name: "Mouse Logitech G502" }))).toBe("/products/mouse.jpg");
  });
});
