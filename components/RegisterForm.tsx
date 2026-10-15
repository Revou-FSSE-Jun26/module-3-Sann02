"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import FormField, { FormError } from "@/components/FormField";
import { useAuth } from "@/hooks/useAuth";
import { loginUser, registerUser } from "@/lib/apiClient";
import { ApiError, getErrorMessage } from "@/lib/errors";
import type { RegisterFormData } from "@/lib/types";

type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: RegisterFormData = { username: "", email: "", password: "", confirmPassword: "" };

/** The four client-side rules; runs before any network request. */
export function validateRegister(form: RegisterFormData): RegisterErrors {
  const errors: RegisterErrors = {};
  if (!form.username.trim()) errors.username = "Username is required";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address";
  if (form.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords do not match";
  return errors;
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
    // Clear a field's error as soon as the user edits it.
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const errs = validateRegister(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return; // stop: never POST invalid data

    setSubmitting(true);
    const email = form.email.trim();
    try {
      // 1) POST /users -> 201. confirmPassword stays on the client.
      await registerUser({ username: form.username.trim(), email, password: form.password });
      // 2) Log straight in to get the JWT used for checkout and "My Orders".
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
    <Card as="section" className="mx-auto w-full max-w-md space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-gray-500">Register to add products to your cart and check out.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-3" aria-label="Register">
        <FormField
          label="Username"
          name="username"
          autoComplete="username"
          value={form.username}
          onChange={(e) => update("username", e.target.value)}
          error={errors.username}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          error={errors.password}
        />
        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
        />
        <FormError message={formError} />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Register"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
