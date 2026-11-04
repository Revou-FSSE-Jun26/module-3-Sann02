/** Shown by route guards while the session loads or a redirect is in flight. */
export default function RouteStatus({ message = "Checking your session…" }: { message?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-12">
      <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}
