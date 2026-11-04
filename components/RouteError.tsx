"use client";

import { useEffect } from "react";
import Card from "@/components/Card";
import { AlertCircleIcon } from "@/components/Icons";
import { buttonStyles } from "@/lib/utils";

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
    <Card as="section" className="mx-auto max-w-lg border-rose-200 bg-rose-50 text-center">
      <div role="alert" className="space-y-3 py-4">
        <AlertCircleIcon size={28} className="mx-auto text-rose-500" aria-hidden="true" />
        <h2 className="font-display text-lg font-bold text-rose-800">Something went wrong</h2>
        <p className="text-sm text-rose-700">
          We couldn&apos;t load the {resource}. The RevoShop API may be offline. Please try again.
        </p>
        {error.digest && <p className="font-mono text-xs text-rose-400">Error ID: {error.digest}</p>}
        <button type="button" onClick={() => retry()} className={buttonStyles.primary}>
          Try again
        </button>
      </div>
    </Card>
  );
}
