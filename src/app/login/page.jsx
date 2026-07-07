"use client";

import { loginUser } from "@/actions/authActions";
import Link from "next/link";
import { useActionState } from "react";
import { useEffect, useRef } from "react";

export default function LoginPage() {
    const [state, formAction] = useActionState(loginUser, null);
    const formRef = useRef(null);

    // Clear form errors on successful login (just before redirect)
    useEffect(() => {
        if (state?.error) {
            // Focus the field with error
            const fieldName = state.field === "email" ? "email" : state.field === "password" ? "password" : null;
            if (fieldName && formRef.current) {
                const field = formRef.current.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    field.focus();
                }
            }
        }
    }, [state]);

    return (
        <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--app-bg)" }}>
            <div
                className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
                style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}
            >
                <h2 className="mb-8 text-center text-4xl font-bold" style={{ color: "var(--app-text)" }}>
                    Login
                </h2>

                <form ref={formRef} action={formAction} className="space-y-5">
                    <div>
                        <label className="mb-2 block font-medium" style={{ color: "var(--app-text-secondary)" }}>
                            Email
                        </label>

                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            style={{
                                background: "color-mix(in srgb, var(--app-surface) 92%, var(--app-bg) 8%)",
                                borderColor: state?.field === "email" ? "#ef4444" : "var(--app-border)",
                                color: "var(--app-text)",
                            }}
                        />
                        {state?.field === "email" && (
                            <p
                                className="mt-2 text-sm"
                                style={{ color: "#ef4444" }}
                                role="alert"
                            >
                                {state.error}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block font-medium" style={{ color: "var(--app-text-secondary)" }}>
                            Password
                        </label>

                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            style={{
                                background: "color-mix(in srgb, var(--app-surface) 92%, var(--app-bg) 8%)",
                                borderColor: state?.field === "password" ? "#ef4444" : "var(--app-border)",
                                color: "var(--app-text)",
                            }}
                        />
                        {state?.field === "password" && (
                            <p
                                className="mt-2 text-sm"
                                style={{ color: "#ef4444" }}
                                role="alert"
                            >
                                {state.error}
                            </p>
                        )}

                        <div className="flex justify-end mt-2">
                            <Link href="/forgot-password" style={{ color: "#c4b5fd" }} className="text-xs font-semibold hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {state?.field === "general" && (
                        <div
                            className="rounded-lg px-4 py-3 text-sm"
                            style={{
                                background: "rgba(239, 68, 68, 0.1)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                color: "#ef4444",
                            }}
                            role="alert"
                        >
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg py-3 text-lg font-semibold transition duration-300"
                        style={{
                            background: "linear-gradient(135deg, var(--accent-from), var(--accent-to))",
                            color: "#fff",
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}