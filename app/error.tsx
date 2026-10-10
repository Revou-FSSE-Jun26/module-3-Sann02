"use client";

import RouteError from "@/components/RouteError";

export default function HomeError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <RouteError {...props} resource="featured products" />;
}
