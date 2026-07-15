import Link from "next/link";

const c = {
    surface: "var(--app-surface)",
    text: "var(--app-text)",
    textSecondary: "var(--app-text-secondary)",
    textMuted: "var(--app-text-muted)",
    accentFrom: "var(--accent-from)",
    accentTo: "var(--accent-to)",
};

/**
 * Reusable Empty State Component
 * 
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.title - Main heading
 * @param {string} props.description - Description text
 * @param {Object} [props.action] - Optional action button
 * @param {string} props.action.label - Button label
 * @param {string} props.action.href - Button link
 * @param {React.ComponentType} [props.action.icon] - Button icon
 * @returns {JSX.Element}
 */
export default function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
            {Icon && (
                <div
                    style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background: "rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                    }}
                >
                    <Icon size={22} color={c.textMuted} />
                </div>
            )}

            <h3
                style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: c.text,
                    margin: "0 0 6px",
                }}
            >
                {title}
            </h3>

            <p
                style={{
                    fontSize: "13px",
                    color: c.textSecondary,
                    margin: 0,
                    maxWidth: "400px",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                {description}
            </p>

            {action && (
                <Link
                    href={action.href}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "20px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#fff",
                        background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                        borderRadius: "9px",
                        padding: "10px 18px",
                        textDecoration: "none",
                        boxShadow: "0 8px 20px -8px rgba(124,58,237,0.5)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow = "0 12px 24px -10px rgba(124,58,237,0.6)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 8px 20px -8px rgba(124,58,237,0.5)";
                    }}
                >
                    {action.icon && <action.icon size={14} />}
                    {action.label}
                </Link>
            )}
        </div>
    );
}

/**
 * Empty State for Search Results
 */
export function EmptySearchState({ searchTerm, onClear }) {
    return (
        <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <div
                style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    opacity: 0.5,
                }}
            >
                🔍
            </div>

            <h3
                style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: c.text,
                    margin: "0 0 6px",
                }}
            >
                No results for &ldquo;{searchTerm}&rdquo;
            </h3>

            <p
                style={{
                    fontSize: "13px",
                    color: c.textSecondary,
                    margin: "0 0 20px",
                }}
            >
                Try adjusting your search or filter to find what you&apos;re looking for.
            </p>

            {onClear && (
                <button
                    onClick={onClear}
                    style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: c.text,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid var(--app-border)",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    }}
                >
                    Clear search
                </button>
            )}
        </div>
    );
}
