import Link from "next/link";
import { BagIcon, ReturnIcon, ShieldIcon, SupportIcon, TruckIcon } from "@/components/Icons";

const PERKS = [
  { icon: TruckIcon, title: "Free shipping", text: "On every order, nationwide" },
  { icon: ShieldIcon, title: "Secure checkout", text: "Your data stays protected" },
  { icon: ReturnIcon, title: "Easy returns", text: "7 days, no questions asked" },
  { icon: SupportIcon, title: "Friendly support", text: "Every day, 08:00 to 22:00" },
];

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All items" },
      { href: "/categories", label: "Shop by category" },
      { href: "/cart", label: "Shopping bag" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/orders", label: "Order history" },
      { href: "/register", label: "Sign up free" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      {/* Trust strip */}
      <div className="border-b border-slate-200 bg-slate-50">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 ring-1 ring-slate-200">
                <Icon />
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-900">{title}</span>
                <span className="block text-sm text-slate-500">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <BagIcon />
            </span>
            <span className="font-display text-xl font-bold text-slate-900">
              Revo<span className="text-brand-600">Shop</span>
            </span>
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-slate-600">
            Everyday electronics, fashion, food and books at honest prices. Every product you see
            comes live from the RevoShop API.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={`${column.title} links`}>
            <p className="text-sm font-semibold text-slate-900">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors duration-200 hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-slate-200">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          &copy; 2026 RevoShop &middot; Built by M Ikhsan Febrian with Next.js and a Flask API
        </p>
      </div>
    </footer>
  );
}
