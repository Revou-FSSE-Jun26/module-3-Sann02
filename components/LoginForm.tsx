"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import FormField, { FormError } from "@/components/FormField";
import { LockIcon, MailIcon, SparklesIcon } from "@/components/Icons";
import { useAuth } from "@/hooks/useAuth";
import { loginUser } from "@/lib/apiClient";
import { ApiError, getErrorMessage } from "@/lib/errors";
import type { LoginFormData } from "@/lib/types";

type LoginErrors = Partial<Record<keyof LoginFormData, string>>;

function fieldFor400(error: ApiError): keyof LoginFormData {
  if (error.field === "password" || error.field === "email") return error.field;
  return /password/i.test(error.message) && !/email/i.test(error.message) ? "password" : "email";
}

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof LoginFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    const missing: LoginErrors = {};
    if (!form.email.trim()) missing.email = "Email is required";
    if (!form.password) missing.password = "Password is required";
    if (Object.keys(missing).length > 0) {
      setFieldErrors(missing);
      return;
    }

    setSubmitting(true);
    try {
      const { user, access_token } = await loginUser({ email: form.email.trim(), password: form.password });
      login(user, access_token);
      toast.success(`Welcome back, ${user.username}!`);
      router.push(user.role === "admin" ? "/dashboard" : "/");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setFormError("Invalid email or password");
        toast.error("Invalid email or password");
      } else if (error instanceof ApiError && error.status === 400) {
        setFieldErrors({ [fieldFor400(error)]: error.message });
      } else {
        const message = getErrorMessage(error, "Login failed. Please try again.");
        setFormError(message);
        toast.error(message);
      }
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
          <SparklesIcon size={22} className="text-white" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Admins land on the dashboard, customers on the home page.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-label="Login">
        <FormField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          icon={MailIcon}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={fieldErrors.email}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={LockIcon}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          error={fieldErrors.password}
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
              Signing in…
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        New to RevoShop?{" "}
        <Link href="/register" className="font-bold text-brand-600 transition-colors duration-200 hover:text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
