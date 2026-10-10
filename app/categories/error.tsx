"use client";

import RouteError from "@/components/RouteError";

export default function CategoriesError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <RouteError {...props} resource="categories" />;
}
