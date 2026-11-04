import Image from "next/image";
import type { ReactNode } from "react";
import { ReturnIcon, ShieldIcon, SparklesIcon, TruckIcon, ZapIcon } from "@/components/Icons";

const PERKS = [
  {
    icon: TruckIcon,
    text: "Free shipping on every order",
    gradient: "from-brand-500 to-brand-400",
  },
  {
    icon: ShieldIcon,
    text: "Secure checkout & buyer protection",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    icon: ReturnIcon,
    text: "Easy 7-day hassle-free returns",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: ZapIcon,
    text: "Instant order confirmation",
    gradient: "from-accent-500 to-accent-400",
  },
];

/** Premium split layout for /login and /register. */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl shadow-lifted lg:grid-cols-2">
      {/* ── Left brand panel ── */}
      <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
        {/* Animated gradient mesh */}
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            background: "linear-gradient(135deg, #0f1a47, #1c38b8, #2448e0, #3866f5, #0f1a47)",
            backgroundSize: "300% 300%",
          }}
        />

        {/* Decorative orbs */}
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(circle, rgb(92 141 252 / 0.6), transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, rgb(249 115 22 / 0.5), transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full blur-2xl opacity-30"
          style={{ background: "radial-gradient(circle, rgb(168 85 247 / 0.6), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full p-10 text-white">
          {/* Brand heading */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-brand-100 backdrop-blur-sm">
              <SparklesIcon size={12} />
              Premium Shopping
            </div>
            <p className="font-display text-3xl font-extrabold leading-tight">
              Shop smarter with RevoShop.
            </p>
            <p className="text-sm leading-relaxed text-brand-200">
              One account keeps your cart, your orders and your favourites in one place.
            </p>
          </div>

          {/* Product image */}
          <div className="relative my-8 overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-2xl animate-float">
            <Image
              src="/products/elektronik/103175613088.jpg"
              alt=""
              width={480}
              height={320}
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
          </div>

          {/* Perks list */}
          <ul className="space-y-3">
            {PERKS.map(({ icon: Icon, text, gradient }) => (
              <li key={text} className="flex items-center gap-3">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-sm`}>
                  <Icon size={14} />
                </span>
                <span className="text-sm text-brand-100">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <div className="flex items-center justify-center bg-white p-6 sm:p-10">
        <div className="w-full [&>section]:border-0 [&>section]:shadow-none">{children}</div>
      </div>
    </div>
  );
}
