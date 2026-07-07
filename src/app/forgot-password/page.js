"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/passwordResetActions";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      const res = await requestPasswordReset(null, formData);

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

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--app-bg)" }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}
      >
        <h2 className="mb-3 text-center text-3xl font-bold" style={{ color: "var(--app-text)" }}>
          Reset Password
        </h2>
        <p className="mb-8 text-center text-sm" style={{ color: "var(--app-text-secondary)" }}>
          Enter your email to receive password reset instructions.
        </p>

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
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider" style={{ color: "var(--app-text-secondary)" }}>
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
                  style={{
                    background: "color-mix(in srgb, var(--app-surface) 92%, var(--app-bg) 8%)",
                    borderColor: "var(--app-border)",
                    color: "var(--app-text)",
                  }}
                />
              </div>
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
              {submitting ? "Sending Reset Link..." : "Send Reset Link"}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold hover:underline"
                style={{ color: "var(--app-text-secondary)" }}
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
