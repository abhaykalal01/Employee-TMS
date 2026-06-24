"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTaskStatus } from "@/actions/taskActions";

const c = {
    field: "#1b1b29",
    border: "rgba(255,255,255,0.08)",
    text: "#f3f4f6",
    textMuted: "#54565f",
};

export default function TaskStatusForm({ taskId, currentStatus, canEdit }) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!canEdit) {
        return (
            <span style={{ fontSize: "12px", fontWeight: 600, color: c.text }}>
                {currentStatus}
            </span>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const formData = new FormData(e.currentTarget);
            await updateTaskStatus(formData);
            router.refresh();
            setSubmitting(false);
        } catch (err) {
            setError(err?.message || "Failed to update status.");
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "160px" }}>
            <input type="hidden" name="id" value={taskId} />
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={submitting}
                    style={{
                        flex: 1,
                        background: c.field,
                        border: `1px solid ${c.border}`,
                        borderRadius: "8px",
                        padding: "8px 10px",
                        fontSize: "12px",
                        color: c.text,
                        outline: "none",
                    }}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#fff",
                        background: submitting ? "#4c4c5c" : "linear-gradient(135deg, #7c3aed, #2563eb)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        cursor: submitting ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                    }}
                >
                    {submitting ? "Saving…" : "Update"}
                </button>
            </div>
            {error && (
                <span style={{ fontSize: "11px", color: "#fca5a5" }}>{error}</span>
            )}
        </form>
    );
}
