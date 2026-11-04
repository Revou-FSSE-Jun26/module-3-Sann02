import Link from "next/link";
import Card from "@/components/Card";
import { SearchIcon } from "@/components/Icons";
import { buttonStyles } from "@/lib/utils";

export default function NotFound() {
  return (
    <Card as="section" className="mx-auto max-w-lg space-y-4 py-10 text-center">
      <SearchIcon size={28} className="mx-auto text-slate-300" aria-hidden="true" />
      <h1 className="font-display text-xl font-bold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-600">That page or product doesn&apos;t exist.</p>
      <Link href="/products" className={buttonStyles.primary}>
        Browse all products
      </Link>
    </Card>
  );
}
