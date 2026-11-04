"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import FormField, { FormError } from "@/components/FormField";
import { LockIcon, MailIcon, UserIcon, UserPlusIcon } from "@/components/Icons";
import { useAuth } from "@/hooks/useAuth";
import { loginUser, registerUser } from "@/lib/apiClient";
import { ApiError, getErrorMessage } from "@/lib/errors";
import type { RegisterFormData } from "@/lib/types";
import { cn } from "@/lib/utils";

type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM: RegisterFormData = { username: "", email: "", password: "", confirmPassword: "" };

export function validateRegister(form: RegisterFormData): RegisterErrors {
  const errors: RegisterErrors = {};
  if (!form.username.trim()) errors.username = "Username is required";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address";
  if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords do not match";
  return errors;
}

/** Password strength indicator */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const levels = [
    { label: "Weak", color: "bg-rose-500", width: "w-1/4" },
    { label: "Fair", color: "bg-accent-500", width: "w-2/4" },
    { label: "Good", color: "bg-yellow-500", width: "w-3/4" },
    { label: "Strong", color: "bg-emerald-500", width: "w-full" },
  ];
  const level = levels[Math.min(score - 1, 3)] ?? levels[0];

  return (
    <div className="mt-1.5 space-y-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={cn("h-full rounded-full transition-all duration-500", level.color, level.width)} />
      </div>
      <p className={cn("text-xs font-semibold", level.color.replace("bg-", "text-"))}>
        {level.label} password
      </p>
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<RegisterFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof RegisterFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const errs = validateRegister(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const email = form.email.trim();
    try {
      await registerUser({ username: form.username.trim(), email, password: form.password });
      const { user, access_token } = await loginUser({ email, password: form.password });
      login(user, access_token);
      toast.success(`Welcome to RevoShop, ${user.username}!`);
      router.push(user.role === "admin" ? "/dashboard" : "/");
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 409
          ? "Email already registered"
          : getErrorMessage(error, "Registration failed. Please try again.");
      setFormError(message);
      toast.error(message);
      setSubmitting(false);
    }
  }

  return (
    <Card as="section" className="mx-auto w-full max-w-md space-y-6 p-7">
      {/* Header */}
      <div className="space-y-1">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl shadow-md"
          style={{ background: "linear-gradient(135deg, #2448e0, #3866f5)" }}
        >
          <UserPlusIcon size={22} className="text-white" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Create account</h1>
        <p className="text-sm text-slate-500">Register to add products to your cart and check out.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Register">
        <FormField
          label="Username"
          name="username"
          autoComplete="username"
          placeholder="your_username"
          icon={UserIcon}
          value={form.username}
          onChange={(e) => update("username", e.target.value)}
          error={errors.username}
        />
        <FormField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          icon={MailIcon}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
        />
        <div>
          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            icon={LockIcon}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            error={errors.password}
          />
          <PasswordStrength password={form.password} />
        </div>
        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          icon={LockIcon}
          value={form.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
        />

        <FormError message={formError} />

        <button
          type="submit"
          disabled={submitting}
          className="btn-shine w-full min-h-11 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100"
          style={{ background: "linear-gradient(135deg, #2448e0, #3866f5)" }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account…
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-brand-600 transition-colors duration-200 hover:text-brand-700 hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
