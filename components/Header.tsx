import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          RevoShop
        </Link>
        {/* Only the nav is a Client Component (it needs usePathname). */}
        <NavBar />
      </div>
    </header>
  );
}
