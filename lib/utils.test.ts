/**
 * Unit tests for lib/utils.ts — all pure utility functions.
 * No DOM required; runs in Node environment via jest.config.ts.
 *
 * Coverage:
 *  - cn()                      class name joiner
 *  - formatPrice()             IDR number formatter
 *  - formatDate()              ISO date formatter (null / invalid / valid)
 *  - getStockStatus()          boundary: 0, 1, 5, 6
 *  - getStockLabel()           all three variants
 *  - getStockBadgeClasses()    includes shared prefix + variant colour
 *  - getButtonClasses()        in-stock vs. out-of-stock styles
 *  - buttonStyles              shape of the exported constants
 *  - getOrderStatusClasses()   known statuses + unknown fallback
 */

import {
  LOW_STOCK_THRESHOLD,
  buttonStyles,
  cn,
  formatDate,
  formatPrice,
  getButtonClasses,
  getOrderStatusClasses,
  getStockBadgeClasses,
  getStockLabel,
  getStockStatus,
} from "./utils";

// ── cn ─────────────────────────────────────────────────────────────────────
describe("cn()", () => {
  it("joins two truthy strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("drops falsy values: false, null, undefined", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string when all values are falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });

  it("handles a single argument", () => {
    expect(cn("only")).toBe("only");
  });

  it("returns empty string with no arguments", () => {
    expect(cn()).toBe("");
  });
});

// ── formatPrice ────────────────────────────────────────────────────────────
describe("formatPrice()", () => {
  it("formats zero as 'Rp 0'", () => {
    expect(formatPrice(0)).toBe("Rp 0");
  });

  it("formats 850000 with Indonesian thousand separator", () => {
    // id-ID locale: 850.000
    expect(formatPrice(850_000)).toBe("Rp 850.000");
  });

  it("accepts a custom currency prefix", () => {
    const result = formatPrice(1_000, "USD");
    expect(result).toMatch(/^USD/);
    expect(result).toContain("1");
  });

  it("formats 1 (one) correctly", () => {
    expect(formatPrice(1)).toBe("Rp 1");
  });
});

// ── formatDate ─────────────────────────────────────────────────────────────
describe("formatDate()", () => {
  it("returns '-' for null", () => {
    expect(formatDate(null)).toBe("-");
  });

  it("returns '-' for an empty string", () => {
    expect(formatDate("")).toBe("-");
  });

  it("returns '-' for an invalid ISO string", () => {
    expect(formatDate("not-a-date")).toBe("-");
  });

  it("returns a non-empty string for a valid ISO date", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(1);
    expect(result).not.toBe("-");
  });
});

// ── getStockStatus ─────────────────────────────────────────────────────────
describe("getStockStatus()", () => {
  it("returns 'out-of-stock' for 0", () => {
    expect(getStockStatus(0)).toBe("out-of-stock");
  });

  it("returns 'out-of-stock' for negative numbers", () => {
    expect(getStockStatus(-5)).toBe("out-of-stock");
  });

  it("returns 'low-stock' for 1", () => {
    expect(getStockStatus(1)).toBe("low-stock");
  });

  it(`returns 'low-stock' at the threshold (${LOW_STOCK_THRESHOLD})`, () => {
    expect(getStockStatus(LOW_STOCK_THRESHOLD)).toBe("low-stock");
  });

  it(`returns 'in-stock' just above the threshold (${LOW_STOCK_THRESHOLD + 1})`, () => {
    expect(getStockStatus(LOW_STOCK_THRESHOLD + 1)).toBe("in-stock");
  });

  it("returns 'in-stock' for large values", () => {
    expect(getStockStatus(9999)).toBe("in-stock");
  });
});

// ── getStockLabel ──────────────────────────────────────────────────────────
describe("getStockLabel()", () => {
  it("returns 'In stock' for in-stock", () => {
    expect(getStockLabel("in-stock")).toBe("In stock");
  });

  it("returns 'Low stock' for low-stock", () => {
    expect(getStockLabel("low-stock")).toBe("Low stock");
  });

  it("returns 'Out of stock' for out-of-stock", () => {
    expect(getStockLabel("out-of-stock")).toBe("Out of stock");
  });
});

// ── getStockBadgeClasses ───────────────────────────────────────────────────
describe("getStockBadgeClasses()", () => {
  const SHARED = "rounded-full";

  it("includes the shared 'rounded-full' class for all variants", () => {
    const statuses = ["in-stock", "low-stock", "out-of-stock"] as const;
    for (const s of statuses) {
      expect(getStockBadgeClasses(s)).toContain(SHARED);
    }
  });

  it("contains 'emerald' for in-stock", () => {
    expect(getStockBadgeClasses("in-stock")).toMatch(/emerald/);
  });

  it("contains an orange/accent color for low-stock", () => {
    expect(getStockBadgeClasses("low-stock")).toMatch(/accent/);
  });

  it("contains 'slate' for out-of-stock", () => {
    expect(getStockBadgeClasses("out-of-stock")).toMatch(/slate/);
  });
});

// ── getButtonClasses ───────────────────────────────────────────────────────
describe("getButtonClasses()", () => {
  it("includes 'bg-brand' when inStock is true", () => {
    expect(getButtonClasses(true)).toMatch(/bg-brand/);
  });

  it("includes 'cursor-not-allowed' when inStock is false", () => {
    expect(getButtonClasses(false)).toContain("cursor-not-allowed");
  });

  it("always includes 'rounded-xl'", () => {
    expect(getButtonClasses(true)).toContain("rounded-xl");
    expect(getButtonClasses(false)).toContain("rounded-xl");
  });
});

// ── buttonStyles ───────────────────────────────────────────────────────────
describe("buttonStyles", () => {
  it("has 'primary', 'secondary', and 'accent' keys", () => {
    expect(typeof buttonStyles.primary).toBe("string");
    expect(typeof buttonStyles.secondary).toBe("string");
    expect(typeof buttonStyles.accent).toBe("string");
  });

  it("primary style contains 'bg-brand-600'", () => {
    expect(buttonStyles.primary).toContain("bg-brand-600");
  });

  it("secondary style contains 'border'", () => {
    expect(buttonStyles.secondary).toContain("border");
  });

  it("accent style contains 'bg-accent'", () => {
    expect(buttonStyles.accent).toContain("bg-accent");
  });
});

// ── getOrderStatusClasses ──────────────────────────────────────────────────
describe("getOrderStatusClasses()", () => {
  const KNOWN_STATUSES = ["pending", "paid", "shipped", "completed", "cancelled"] as const;

  it("always includes 'rounded-full' and 'capitalize'", () => {
    for (const s of KNOWN_STATUSES) {
      const cls = getOrderStatusClasses(s);
      expect(cls).toContain("rounded-full");
      expect(cls).toContain("capitalize");
    }
  });

  it("returns orange/accent classes for 'pending'", () => {
    expect(getOrderStatusClasses("pending")).toMatch(/accent/);
  });

  it("returns blue/brand classes for 'paid'", () => {
    expect(getOrderStatusClasses("paid")).toMatch(/brand/);
  });

  it("returns sky classes for 'shipped'", () => {
    expect(getOrderStatusClasses("shipped")).toMatch(/sky/);
  });

  it("returns emerald classes for 'completed'", () => {
    expect(getOrderStatusClasses("completed")).toMatch(/emerald/);
  });

  it("returns rose classes for 'cancelled'", () => {
    expect(getOrderStatusClasses("cancelled")).toMatch(/rose/);
  });

  it("returns a fallback class for an unknown status", () => {
    const cls = getOrderStatusClasses("unknown_xyz");
    expect(cls).toContain("slate");
    expect(cls).toContain("rounded-full");
  });
});
