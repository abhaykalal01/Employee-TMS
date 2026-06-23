import SubmitButton from "@/components/SubmitButton";
import { createTask } from "@/actions/taskActions";
import { ClipboardList, Flag, ListTodo } from "lucide-react";

const c = {
    bg: "#0a0a12",
    surface: "#13131e",
    field: "#1b1b29",
    border: "rgba(255,255,255,0.08)",
    text: "#f3f4f6",
    textSecondary: "#9295a3",
    textMuted: "#54565f",
    accentFrom: "#7c3aed",
    accentTo: "#2563eb",
};

export default function CreateTaskPage() {
    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "640px", margin: "0 auto", padding: "28px 20px 64px" }}>

                {/* Breadcrumb */}
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: c.textMuted, marginBottom: "12px" }}>
                    DASHBOARD&nbsp;/&nbsp;TASKS&nbsp;/&nbsp;<span style={{ color: "#c4b5fd" }}>CREATE</span>
                </div>

                {/* Header */}
                <div style={{ marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: "0 8px 22px -8px rgba(124,58,237,0.55)",
                        }}
                    >
                        <ClipboardList size={19} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.01em", margin: 0 }}>
                            Create Task
                        </h1>
                        <p style={{ fontSize: "13px", color: c.textSecondary, marginTop: "4px" }}>
                            Add task details and choose a status to start tracking work instantly.
                        </p>
                    </div>
                </div>

                {/* Form card */}
                <form
                    action={createTask}
                    style={{
                        background: c.surface,
                        border: `1px solid ${c.border}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

                        {/* Title */}
                        <div>
                            <label
                                htmlFor="title"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    letterSpacing: "0.04em",
                                    color: "#9ca3af",
                                    textTransform: "uppercase",
                                    marginBottom: "8px",
                                }}
                            >
                                <ListTodo size={13} /> Task Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                placeholder="e.g. Fix login redirect bug"
                                required
                                style={{
                                    width: "100%",
                                    background: c.field,
                                    border: `1px solid ${c.border}`,
                                    borderRadius: "10px",
                                    padding: "12px 14px",
                                    fontSize: "14px",
                                    color: c.text,
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                            <p style={{ fontSize: "12px", color: c.textMuted, marginTop: "6px" }}>
                                Keep it short and specific — this is what shows up in task lists and reports.
                            </p>
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    letterSpacing: "0.04em",
                                    color: "#9ca3af",
                                    textTransform: "uppercase",
                                    marginBottom: "8px",
                                }}
                            >
                                <Flag size={13} /> Status
                            </label>
                            <div style={{ position: "relative" }}>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue="Pending"
                                    style={{
                                        width: "100%",
                                        background: c.field,
                                        border: `1px solid ${c.border}`,
                                        borderRadius: "10px",
                                        padding: "12px 14px",
                                        fontSize: "14px",
                                        color: c.text,
                                        outline: "none",
                                        appearance: "none",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <p style={{ fontSize: "12px", color: c.textMuted, marginTop: "6px" }}>
                                You can change this anytime from the task list.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div
                        style={{
                            borderTop: `1px solid ${c.border}`,
                            background: "#0f0f18",
                            padding: "16px 24px",
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <SubmitButton text="Create Task" loadingText="Creating..." />
                    </div>
                </form>
            </div>
        </div>
    );
}