import LoadingSpinner from "@/components/LoadingSpinner";

const c = {
    bg: "var(--app-bg)",
    surface: "var(--app-surface)",
    border: "var(--app-border)",
    text: "var(--app-text)",
};

export default function MyTasksLoading() {
    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "28px 20px 64px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <div
                        style={{
                            height: "12px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            width: "180px",
                            marginBottom: "10px",
                        }}
                    />
                    <div
                        style={{
                            height: "24px",
                            background: "rgba(255,255,255,0.15)",
                            borderRadius: "6px",
                            width: "140px",
                            marginBottom: "8px",
                        }}
                    />
                    <div
                        style={{
                            height: "12px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            width: "320px",
                        }}
                    />
                </div>

                <div
                    style={{
                        background: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: "14px",
                        overflow: "hidden",
                        padding: "32px 20px",
                    }}
                >
                    <LoadingSpinner size="md" text="Loading your tasks..." />
                </div>
            </div>
        </div>
    );
}
