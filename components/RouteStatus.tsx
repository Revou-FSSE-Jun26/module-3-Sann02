/** Shown by route guards while the session loads or a redirect is in flight. */
export default function RouteStatus({ message = "Checking your session…" }: { message?: string }) {
  return (
    <p role="status" className="py-10 text-center text-sm text-slate-500">
      {message}
    </p>
  );
}
