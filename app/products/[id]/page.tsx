import type { Metadata } from "next";

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Product #${id}` };
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  return <h1 className="text-2xl font-bold">Product #{id}</h1>;
}
