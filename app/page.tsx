import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-bold">Welcome to RevoShop</h1>
      <p className="text-gray-600">Featured products will load here from the API.</p>
    </section>
  );
}
