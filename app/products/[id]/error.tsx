"use client";

import RouteError from "@/components/RouteError";

export default function ProductDetailError(props: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <RouteError {...props} resource="product details" />;
}
