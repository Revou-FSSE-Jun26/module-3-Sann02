"use client";

import { useEffect } from "react";
import Card from "@/components/Card";

interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
  /** What failed, e.g. "products". */
  resource: string;
}

/** Shared friendly UI for every route's error.tsx boundary. */
export default function RouteError({ error, retry, resource }: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card as="section" className="mx-auto max-w-lg border-red-200 bg-red-50 text-center">
      <div role="alert" className="space-y-3 py-4">
        <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
        <p className="text-sm text-red-700">
          We couldn&apos;t load the {resource}. The RevoShop API may be offline. Please try again.
        </p>
        {error.digest && <p className="font-mono text-xs text-red-400">Error ID: {error.digest}</p>}
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Try again
        </button>
      </div>
    </Card>
  );
}
