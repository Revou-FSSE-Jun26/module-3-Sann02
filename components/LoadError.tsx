import Card from "@/components/Card";

/** Inline error for client-side fetches, with a retry button. */
export default function LoadError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="border-rose-200 bg-rose-50 text-center">
      <div role="alert" className="space-y-3 py-4">
        <p className="text-sm text-rose-700">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Try again
          </button>
        )}
      </div>
    </Card>
  );
}
