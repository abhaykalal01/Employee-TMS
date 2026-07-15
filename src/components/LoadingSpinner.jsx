const c = {
    accentFrom: "var(--accent-from)",
    accentTo: "var(--accent-to)",
    text: "var(--app-text)",
    textMuted: "var(--app-text-muted)",
};

/**
 * Reusable Loading Spinner Component
 * 
 * @param {Object} props
 * @param {string} [props.size="md"] - Size: "sm" | "md" | "lg"
 * @param {string} [props.text] - Optional loading text
 * @param {boolean} [props.fullPage=false] - Whether to center in full page
 * @returns {JSX.Element}
 */
export default function LoadingSpinner({ size = "md", text, fullPage = false }) {
    const sizeMap = {
        sm: 20,
        md: 32,
        lg: 48,
    };

    const spinnerSize = sizeMap[size] || sizeMap.md;

    const content = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
            }}
        >
            <div
                className="spinner"
                style={{
                    width: `${spinnerSize}px`,
                    height: `${spinnerSize}px`,
                    border: "3px solid rgba(124, 58, 237, 0.2)",
                    borderTop: "3px solid var(--accent-from)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }}
                role="status"
                aria-label="Loading"
            />
            {text && (
                <p
                    style={{
                        margin: 0,
                        fontSize: "14px",
                        color: c.textMuted,
                        fontWeight: 500,
                    }}
                >
                    {text}
                </p>
            )}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    if (fullPage) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "60vh",
                    width: "100%",
                }}
            >
                {content}
            </div>
        );
    }

    return content;
}

/**
 * Skeleton Loader for cards/rows
 */
export function SkeletonLoader({ rows = 3, type = "card" }) {
    if (type === "card") {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {Array.from({ length: rows }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "12px",
                            padding: "20px",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    >
                        <div
                            style={{
                                height: "16px",
                                background: "rgba(255,255,255,0.1)",
                                borderRadius: "4px",
                                marginBottom: "12px",
                                width: "60%",
                            }}
                        />
                        <div
                            style={{
                                height: "12px",
                                background: "rgba(255,255,255,0.1)",
                                borderRadius: "4px",
                                width: "40%",
                            }}
                        />
                    </div>
                ))}
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}</style>
            </div>
        );
    }

    // Table row skeleton
    return (
        <div>
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        display: "flex",
                        gap: "16px",
                        padding: "16px 20px",
                        borderBottom: "1px solid var(--app-border)",
                        animation: "pulse 1.5s ease-in-out infinite",
                        animationDelay: `${i * 0.1}s`,
                    }}
                >
                    <div
                        style={{
                            height: "14px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            flex: 1,
                        }}
                    />
                    <div
                        style={{
                            height: "14px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            width: "120px",
                        }}
                    />
                    <div
                        style={{
                            height: "14px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            width: "80px",
                        }}
                    />
                </div>
            ))}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
