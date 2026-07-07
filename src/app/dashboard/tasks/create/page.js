import SubmitButton from "@/components/SubmitButton";
import { createTask } from "@/actions/taskActions";
import { getEmployees } from "@/services/userService";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { ClipboardList, Flag, ListTodo, User } from "lucide-react";

const c = {
    bg: "var(--app-bg)",
    surface: "var(--app-surface)",
    field: "var(--surface)",
    border: "var(--app-border)",
    text: "var(--app-text)",
    textSecondary: "var(--app-text-secondary)",
    textMuted: "var(--app-text-muted)",
    accentFrom: "var(--accent-from)",
    accentTo: "var(--accent-to)",
};

export default async function CreateTaskPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        redirect("/dashboard");
    }

    const employees = await getEmployees();

    return (
        <div style={{ background: c.bg, minHeight: "100vh", color: c.text }}>
            <div style={{ maxWidth: "640px", margin: "0 auto", padding: "28px 20px 64px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: c.textMuted, marginBottom: "12px" }}>
                    DASHBOARD&nbsp;/&nbsp;TASKS&nbsp;/&nbsp;<span style={{ color: "#c4b5fd" }}>CREATE</span>
                </div>

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
                            Create a task and assign it to an employee.
                        </p>
                    </div>
                </div>

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
                        <Field
                            icon={<ListTodo size={13} />}
                            label="Task Title"
                            name="title"
                            type="text"
                            placeholder="e.g. Fix login redirect bug"
                            required
                            hint="Keep it short and specific — this is what shows up in task lists."
                        />

                        <div>
                            <label
                                htmlFor="assignedTo"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    letterSpacing: "0.04em",
                                    color: "var(--app-text-secondary)",
                                    textTransform: "uppercase",
                                    marginBottom: "8px",
                                }}
                            >
                                <User size={13} /> Assign To Employee
                            </label>
                            <select
                                id="assignedTo"
                                name="assignedTo"
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
                            >
                                <option value="">Select employee…</option>
                                {employees.map((employee) => (
                                    <option key={employee._id} value={employee._id}>
                                        {employee.name} ({employee.email})
                                    </option>
                                ))}
                            </select>
                            <p style={{ fontSize: "12px", color: c.textMuted, marginTop: "6px" }}>
                                Only employees with role &quot;employee&quot; are listed.
                            </p>
                        </div>

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
                                    color: "var(--app-text-secondary)",
                                    textTransform: "uppercase",
                                    marginBottom: "8px",
                                }}
                            >
                                <Flag size={13} /> Status
                            </label>
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
                                    boxSizing: "border-box",
                                }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div
                        style={{
                            borderTop: `1px solid ${c.border}`,
                            background: "var(--surface-strong)",
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

function Field({ icon, label, name, type, placeholder, required, hint }) {
    return (
        <div>
            <label
                htmlFor={name}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    color: "var(--app-text-secondary)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                }}
            >
                {icon} {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                style={{
                    width: "100%",
                    background: "var(--app-surface)",
                    border: "1px solid var(--app-border)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    fontSize: "14px",
                    color: "var(--app-text)",
                    outline: "none",
                    boxSizing: "border-box",
                }}
            />
            {hint && (
                <p style={{ fontSize: "12px", color: "var(--app-text-muted)", marginTop: "6px" }}>{hint}</p>
            )}
        </div>
    );
}
