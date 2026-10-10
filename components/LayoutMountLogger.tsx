"use client";

import { useEffect } from "react";

/**
 * Proof that a layout stays mounted: open the browser console and navigate
 * between /products and /products/[id]. "mounted" is logged only once;
 * "unmounted" only appears after leaving the /products section.
 */
export default function LayoutMountLogger({ name }: { name: string }) {
  useEffect(() => {
    console.log(`[${name}] mounted`);
    return () => console.log(`[${name}] unmounted`);
  }, [name]);

  return null;
}
