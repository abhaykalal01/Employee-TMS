import Link from "next/link";

const c = {
    border: "var(--app-border)",
    text: "var(--app-text)",
    textMuted: "var(--app-text-muted)",
    textSecondary: "var(--app-text-secondary)",
    accentFrom: "var(--accent-from)",
    accentTo: "var(--accent-to)",
};

/**
 * Reusable Pagination Component
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current active page number
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.buildHref - Function that returns href for a given page number
 * @param {string} [props.className] - Optional CSS class
 * @returns {JSX.Element|null}
 */
export default function Pagination({ currentPage, totalPages, buildHref, className = "" }) {
    if (totalPages <= 1) {
        return null;
    }

    const visiblePages = getVisiblePages(totalPages, currentPage);

    return (
        <div
            className={className}
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderTop: `1px solid ${c.border}`,
            }}
        >
            <div style={{ fontSize: "12px", color: c.textSecondary }}>
                Page {currentPage} of {totalPages}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                {/* Previous Button */}
                <Link
                    href={buildHref(Math.max(1, currentPage - 1))}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "84px",
                        borderRadius: "9px",
                        border: `1px solid ${c.border}`,
                        padding: "8px 12px",
                        color: currentPage === 1 ? c.textMuted : c.text,
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: 600,
                        background: currentPage === 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        pointerEvents: currentPage === 1 ? "none" : "auto",
                    }}
                    aria-disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    Previous
                </Link>

                {/* Page Numbers */}
                {visiblePages.map((pageNumber, index) => {
                    if (pageNumber === "ellipsis") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                style={{
                                    color: c.textMuted,
                                    fontSize: "13px",
                                    padding: "0 2px",
                                }}
                                aria-hidden="true"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = pageNumber === currentPage;
                    return (
                        <Link
                            key={pageNumber}
                            href={buildHref(pageNumber)}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "36px",
                                borderRadius: "9px",
                                border: isActive ? `1px solid rgba(124,58,237,0.4)` : `1px solid ${c.border}`,
                                padding: "8px 10px",
                                color: isActive ? "#fff" : c.text,
                                background: isActive
                                    ? `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`
                                    : "rgba(255,255,255,0.05)",
                                textDecoration: "none",
                                fontSize: "13px",
                                fontWeight: 700,
                                transition: "all 0.2s ease",
                            }}
                            aria-current={isActive ? "page" : undefined}
                            aria-label={`Page ${pageNumber}`}
                        >
                            {pageNumber}
                        </Link>
                    );
                })}

                {/* Next Button */}
                <Link
                    href={buildHref(Math.min(totalPages, currentPage + 1))}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "72px",
                        borderRadius: "9px",
                        border: `1px solid ${c.border}`,
                        padding: "8px 12px",
                        color: currentPage === totalPages ? c.textMuted : c.text,
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: 600,
                        background: currentPage === totalPages ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        pointerEvents: currentPage === totalPages ? "none" : "auto",
                    }}
                    aria-disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    Next
                </Link>
            </div>
        </div>
    );
}

/**
 * Calculate visible page numbers with ellipsis
 * Shows first page, last page, and pages around current page
 */
function getVisiblePages(totalPages, currentPage) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const showLeftEllipsis = currentPage > 3;
    const showRightEllipsis = currentPage < totalPages - 2;

    // Always show first page
    pages.push(1);

    // Show left ellipsis if needed
    if (showLeftEllipsis) {
        pages.push("ellipsis");
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
            pages.push(i);
        }
    }

    // Show right ellipsis if needed
    if (showRightEllipsis) {
        pages.push("ellipsis");
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
        pages.push(totalPages);
    }

    return pages;
}
