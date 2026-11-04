import Card from "@/components/Card";
import { AlertCircleIcon } from "@/components/Icons";
import { buttonStyles } from "@/lib/utils";

/** Inline error for client-side fetches, with a retry button. */
export default function LoadError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="border-rose-200 bg-rose-50 text-center">
      <div role="alert" className="space-y-3 py-4">
        <AlertCircleIcon size={28} className="mx-auto text-rose-500" aria-hidden="true" />
        <p className="text-sm text-rose-700">{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className={buttonStyles.primary}>
            Try again
          </button>
        )}
      </div>
    </Card>
  );
}
