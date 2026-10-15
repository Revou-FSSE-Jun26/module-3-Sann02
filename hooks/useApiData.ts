"use client";

import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/errors";

interface ApiData<T> {
  data: T | null;
  error: string;
  loading: boolean;
  /** Re-run the fetch, e.g. after a create/update/delete. */
  reload: () => Promise<void>;
}

/**
 * Fetch once on mount (and whenever `fetcher` changes) from a Client Component.
 * `fetcher` must be stable: wrap it in useCallback or define it at module level.
 */
export function useApiData<T>(fetcher: () => Promise<T>): ApiData<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetcher());
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load data from the RevoShop API."));
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(getErrorMessage(err, "Couldn't load data from the RevoShop API."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  return { data, error, loading, reload };
}
