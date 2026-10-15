"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import FormField, { FormError } from "@/components/FormField";
import { useAuth } from "@/hooks/useAuth";
import { loginUser } from "@/lib/apiClient";
import { ApiError, getErrorMessage } from "@/lib/errors";
import type { LoginFormData } from "@/lib/types";

type LoginErrors = Partial<Record<keyof LoginFormData, string>>;

/** Which input a 400 message belongs to (the API names the field in its message). */
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

    // Quick client check so an empty field is reported without a round trip.
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
      login(user, access_token); // Context (Header updates now) + localStorage (survives refresh)
      toast.success(`Welcome back, ${user.username}!`);
      router.push(user.role === "admin" ? "/dashboard" : "/");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // One deliberately vague, form-level message.
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
    <Card as="section" className="mx-auto w-full max-w-md space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-sm text-gray-500">Admins land on the dashboard, customers on the home page.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-3" aria-label="Login">
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
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
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          error={fieldErrors.password}
        />
        <FormError message={formError} />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Login"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        New to RevoShop?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:underline">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
