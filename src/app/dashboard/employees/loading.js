import LoadingSpinner, { SkeletonLoader } from "@/components/LoadingSpinner";

const c = {
    bg: "var(--app-bg)",
    surface: "var(--app-surface)",
    border: "var(--app-border)",
    text: "var(--app-text)",
    textMuted: "var(--app-text-muted)",
};

export default function EmployeesLoading() {
    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 64px" }}>
                {/* Header Skeleton */}
                <div style={{ marginBottom: "20px" }}>
                    <div
                        style={{
                            height: "12px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            width: "220px",
                            marginBottom: "10px",
                        }}
                    />
                    <div
                        style={{
                            height: "24px",
                            background: "rgba(255,255,255,0.15)",
                            borderRadius: "6px",
                            width: "160px",
                            marginBottom: "8px",
                        }}
                    />
                    <div
                        style={{
                            height: "12px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            width: "280px",
                        }}
                    />
                </div>

                {/* Stats Skeleton */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1px",
                        background: c.border,
                        border: `1px solid ${c.border}`,
                        borderRadius: "14px",
                        overflow: "hidden",
                        marginBottom: "20px",
                    }}
                >
                    {[1, 2].map((i) => (
                        <div key={i} style={{ background: c.surface, padding: "16px 18px" }}>
                            <div
                                style={{
                                    height: "20px",
                                    background: "rgba(255,255,255,0.15)",
                                    borderRadius: "4px",
                                    width: "60px",
                                    marginBottom: "6px",
                                }}
                            />
                            <div
                                style={{
                                    height: "12px",
                                    background: "rgba(255,255,255,0.1)",
                                    borderRadius: "4px",
                                    width: "100px",
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Content Skeleton */}
                <div
                    style={{
                        background: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: "14px",
                        overflow: "hidden",
                        padding: "32px 20px",
                    }}
                >
                    <LoadingSpinner size="md" text="Loading employees..." />
                </div>
            </div>
        </div>
    );
}
