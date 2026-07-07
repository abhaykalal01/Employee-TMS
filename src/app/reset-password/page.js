"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/actions/passwordResetActions";
import { Lock, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("token", token);

    try {
      const res = await resetPassword(null, formData);

      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccessMessage(res.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div
          className="mb-6 rounded-lg px-4 py-3 text-sm"
          style={{
            color: "#fca5a5",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
          }}
        >
          Missing or invalid reset token. Please request a new password reset.
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          style={{ color: "#c4b5fd" }}
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div
          className="mb-5 rounded-lg px-4 py-3 text-sm"
          style={{
            color: "#fca5a5",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
          }}
        >
          {error}
        </div>
      )}

      {successMessage ? (
        <div className="text-center">
          <div
            className="mb-6 rounded-lg px-4 py-3 text-sm text-left"
            style={{
              color: "#86efac",
              background: "rgba(52, 211, 153, 0.1)",
              border: "1px solid rgba(52, 211, 153, 0.25)",
            }}
          >
            {successMessage}
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
            style={{ color: "#c4b5fd" }}
          >
            <ArrowLeft size={16} /> Go to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              New Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              style={{
                background: "color-mix(in srgb, var(--app-surface) 92%, var(--app-bg) 8%)",
                borderColor: "var(--app-border)",
                color: "var(--app-text)",
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Repeat new password"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
              style={{
                background: "color-mix(in srgb, var(--app-surface) 92%, var(--app-bg) 8%)",
                borderColor: "var(--app-border)",
                color: "var(--app-text)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg py-3 text-sm font-semibold transition duration-300 active:scale-[0.99] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, var(--accent-from), var(--accent-to))",
              color: "#fff",
              boxShadow: "0 8px 20px -6px rgba(124, 58, 237, 0.5)",
            }}
          >
            {submitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--app-bg)" }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}
      >
        <h2 className="mb-3 text-center text-3xl font-bold" style={{ color: "var(--app-text)" }}>
          Set New Password
        </h2>
        <p className="mb-8 text-center text-sm" style={{ color: "var(--app-text-secondary)" }}>
          Enter and confirm your new password below.
        </p>

        <Suspense fallback={<div className="text-center text-sm py-4" style={{ color: "var(--app-text-secondary)" }}>Loading reset context...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
