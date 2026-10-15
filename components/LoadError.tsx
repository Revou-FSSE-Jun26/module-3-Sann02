import Card from "@/components/Card";

/** Inline error for client-side fetches, with a retry button. */
export default function LoadError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="border-red-200 bg-red-50 text-center">
      <div role="alert" className="space-y-3 py-4">
        <p className="text-sm text-red-700">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Try again
          </button>
        )}
      </div>
    </Card>
  );
}
