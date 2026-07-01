export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-20" style={{ background: "var(--app-bg)", color: "var(--app-text)" }}>
            <div className="w-full max-w-3xl space-y-6">
                <div className="h-12 w-full rounded-full skeleton" style={{ backgroundColor: "color-mix(in srgb, var(--app-surface) 90%, transparent)" }} />
                <div className="h-72 rounded-3xl skeleton" style={{ backgroundColor: "color-mix(in srgb, var(--app-surface) 85%, transparent)" }} />
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="h-28 rounded-3xl skeleton" style={{ backgroundColor: "color-mix(in srgb, var(--app-surface) 85%, transparent)" }} />
                    <div className="h-28 rounded-3xl skeleton" style={{ backgroundColor: "color-mix(in srgb, var(--app-surface) 85%, transparent)" }} />
                    <div className="h-28 rounded-3xl skeleton" style={{ backgroundColor: "color-mix(in srgb, var(--app-surface) 85%, transparent)" }} />
                </div>
            </div>
        </div>
    );
}
