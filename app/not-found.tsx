import Link from "next/link";
import Card from "@/components/Card";

export default function NotFound() {
  return (
    <Card as="section" className="mx-auto max-w-lg space-y-3 py-8 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm text-gray-600">That page or product doesn&apos;t exist.</p>
      <Link href="/products" className="inline-block font-semibold text-blue-600 hover:underline">
        Browse all products
      </Link>
    </Card>
  );
}
