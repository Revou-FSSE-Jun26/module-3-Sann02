"use client";

import RouteError from "@/components/RouteError";

export default function OrdersError(props: { error: Error & { digest?: string }; retry: () => void }) {
  return <RouteError {...props} resource="orders" />;
}
