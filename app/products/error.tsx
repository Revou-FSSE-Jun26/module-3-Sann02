"use client";

import RouteError from "@/components/RouteError";

export default function ProductsError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <RouteError {...props} resource="products" />;
}
