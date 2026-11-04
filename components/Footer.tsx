import Link from "next/link";
import {
  BagIcon,
  ClockIcon,
  GithubIcon,
  HeartIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  ReturnIcon,
  ShieldIcon,
  SupportIcon,
  TruckIcon,
  TwitterIcon,
} from "@/components/Icons";

const PERKS = [
  {
    icon: TruckIcon,
    title: "Free Shipping",
    text: "On every order, nationwide",
    gradient: "from-brand-500 to-brand-400",
    glow: "shadow-[0_0_16px_-2px_rgb(56_102_245/0.4)]",
  },
  {
    icon: ShieldIcon,
    title: "Secure Checkout",
    text: "Your data stays protected",
    gradient: "from-emerald-500 to-teal-400",
    glow: "shadow-[0_0_16px_-2px_rgb(16_185_129/0.4)]",
  },
  {
    icon: ReturnIcon,
    title: "Easy Returns",
    text: "7 days, no questions asked",
    gradient: "from-violet-500 to-purple-400",
    glow: "shadow-[0_0_16px_-2px_rgb(139_92_246/0.4)]",
  },
  {
    icon: SupportIcon,
    title: "Friendly support",
    text: "Every day, 08:00 to 22:00",
    gradient: "from-accent-500 to-accent-400",
    glow: "shadow-[0_0_16px_-2px_rgb(249_115_22/0.4)]",
  },
];

const SHOP_LINKS = [
  { href: "/products", label: "All Products" },
  { href: "/categories", label: "Shop by Category" },
  { href: "/cart", label: "Shopping Bag" },
];

const ACCOUNT_LINKS = [
  { href: "/orders", label: "Order History" },
  { href: "/register", label: "Sign Up Free" },
  { href: "/login", label: "Login" },
];

const SOCIAL = [
  { icon: GithubIcon, href: "https://github.com", label: "GitHub" },
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter / X" },
];

export default function Footer() {
  return (
    <footer className="mt-16">
      {/* ── Trust perks strip ── */}
      <div className="border-y border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {PERKS.map(({ icon: Icon, title, text, gradient, glow }) => (
            <li key={title} className="flex items-center gap-4">
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md ${glow} transition-transform duration-300 hover:scale-110`}
              >
                <Icon size={22} />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-900">{title}</span>
                <span className="block text-sm text-slate-500">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Main dark footer ── */}
      <div className="bg-slate-950 text-slate-400">
        {/* Gradient top accent line */}
        <div
          aria-hidden="true"
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, #3866f5 30%, #f97316 70%, transparent)" }}
        />

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">

            {/* Brand column */}
            <div className="space-y-5">
              <Link href="/" className="group inline-flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg transition-all duration-300 group-hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #2448e0, #3866f5)" }}
                >
                  <BagIcon size={20} />
                </span>
                <span className="font-display text-xl font-bold text-white">
                  Revo<span className="text-brand-300">Shop</span>
                </span>
              </Link>

              <p className="max-w-xs text-sm leading-relaxed text-slate-400">
                Laptops, smartphones, TVs, PCs and audio gear at honest prices.
                Every product comes live from the RevoShop API.
              </p>

              {/* Contact info */}
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MapPinIcon size={14} className="shrink-0 text-brand-400" />
                  <span>Jakarta, Indonesia</span>
                </li>
                <li className="flex items-center gap-2">
                  <MailIcon size={14} className="shrink-0 text-brand-400" />
                  <span>hello@revoshop.id</span>
                </li>
                <li className="flex items-center gap-2">
                  <ClockIcon size={14} className="shrink-0 text-brand-400" />
                  <span>Mon to Sun, 08:00 to 22:00 WIB</span>
                </li>
              </ul>

              {/* Social links */}
              <div className="flex gap-3">
                {SOCIAL.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition-all duration-200 hover:border-brand-500 hover:bg-brand-500/10 hover:text-brand-400"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop links */}
            <div>
              <p className="mb-4 text-sm font-semibold text-slate-300">Shop</p>
              <ul className="space-y-3">
                {SHOP_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                    >
                      <span className="h-px w-4 bg-slate-700 transition-all duration-200 group-hover:w-6 group-hover:bg-brand-400" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account links */}
            <div>
              <p className="mb-4 text-sm font-semibold text-slate-300">Account</p>
              <ul className="space-y-3">
                {ACCOUNT_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                    >
                      <span className="h-px w-4 bg-slate-700 transition-all duration-200 group-hover:w-6 group-hover:bg-brand-400" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-slate-500">
              © 2026 RevoShop. Built by M Ikhsan Febrian with Next.js and a Flask API.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              Made with <HeartIcon size={12} className="text-rose-500" fill="currentColor" /> in Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
