import Image from "next/image";
import type { ReactNode } from "react";
import { ReturnIcon, ShieldIcon, TruckIcon } from "@/components/Icons";

const PERKS = [
  { icon: TruckIcon, text: "Free shipping on every order" },
  { icon: ShieldIcon, text: "Secure checkout and buyer protection" },
  { icon: ReturnIcon, text: "Easy 7-day returns" },
];

/** Split layout for /login and /register: brand panel on large screens, form on the right. */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/40 blur-3xl"
        />
        <div className="relative space-y-4">
          <p className="font-display text-3xl font-bold leading-tight">
            Shop smarter with Revo<span className="text-accent-400">Shop</span>.
          </p>
          <p className="text-brand-100">
            One account keeps your cart, your orders and your favourites in one place.
          </p>
        </div>
        <Image
          src="/products/laptop.jpg"
          alt=""
          width={480}
          height={320}
          className="relative my-8 aspect-[3/2] w-full rounded-2xl object-cover ring-1 ring-white/10"
        />
        <ul className="relative space-y-3 text-sm text-brand-100">
          {PERKS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <Icon className="text-accent-400" />
              {text}
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex items-center justify-center p-4 sm:p-8">
        {/* The form keeps its own Card; flatten it inside the shell. */}
        <div className="w-full [&>section]:border-0 [&>section]:shadow-none">{children}</div>
      </div>
    </div>
  );
}
