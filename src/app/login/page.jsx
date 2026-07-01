import { loginUser } from "@/actions/authActions";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--app-bg)" }}>
            <div
                className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
                style={{ background: "var(--app-surface)", border: "1px solid var(--app-border)" }}
            >
                <h2 className="mb-8 text-center text-4xl font-bold" style={{ color: "var(--app-text)" }}>
                    Login
                </h2>

                <form action={loginUser} className="space-y-5">
                    <div>
                        <label className="mb-2 block font-medium" style={{ color: "var(--app-text-secondary)" }}>
                            Email
                        </label>

                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            style={{
                                background: "color-mix(in srgb, var(--app-surface) 92%, var(--app-bg) 8%)",
                                borderColor: "var(--app-border)",
                                color: "var(--app-text)",
                            }}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium" style={{ color: "var(--app-text-secondary)" }}>
                            Password
                        </label>

                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                            style={{
                                background: "color-mix(in srgb, var(--app-surface) 92%, var(--app-bg) 8%)",
                                borderColor: "var(--app-border)",
                                color: "var(--app-text)",
                            }}
                        />
                    </div>

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