"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, ShieldCheck, ChevronDown, Save } from "lucide-react";
import { updateEmployee } from "@/actions/employeeActions";

export default function EditEmployeeForm({ employee }) {
    const [role, setRole] = useState(employee.role || "employee");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const formData = new FormData(e.currentTarget);
            await updateEmployee(formData);
        } catch (err) {
            if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
            setError(err?.message || "Failed to update employee. Please try again.");
            setSubmitting(false);
        }
    }

    return (
        <div
            style={{ background: "#0a0a12" }}
            className="min-h-screen w-full flex items-start sm:items-center justify-center px-4 py-10 sm:py-16"
        >
            <div className="w-full max-w-2xl">
                <div className="text-xs sm:text-sm mb-3 tracking-wide" style={{ color: "#6b7280" }}>
                    EMPLOYEES&nbsp;/&nbsp;
                    <span style={{ color: "#c4b5fd" }}>EDIT PROFILE</span>
                </div>

                <div className="mb-6 sm:mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1
                            className="text-2xl sm:text-3xl font-semibold tracking-tight"
                            style={{ color: "#f3f4f6" }}
                        >
                            Edit Employee
                        </h1>
                        <p className="text-sm mt-1.5" style={{ color: "#8b8d98" }}>
                            Update team member details, work email, and access role.
                        </p>
                    </div>
                    <div
                        className="hidden sm:flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
                        style={{
                            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                            boxShadow: "0 8px 24px -8px rgba(124,58,237,0.6)",
                        }}
                    >
                        <User size={20} color="#fff" strokeWidth={2} />
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: "#14141f",
                        border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    className="rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
                >
                    <input type="hidden" name="id" value={employee._id} />

                    <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                        {error && (
                            <p
                                className="text-sm rounded-lg px-4 py-3"
                                style={{
                                    color: "#fca5a5",
                                    background: "rgba(239,68,68,0.1)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                }}
                            >
                                {error}
                            </p>
                        )}

                        <Field
                            icon={<User size={16} />}
                            label="Full Name"
                            name="name"
                            type="text"
                            defaultValue={employee.name}
                            placeholder="e.g. Sarah Johnson"
                            required
                        />

                        <Field
                            icon={<Mail size={16} />}
                            label="Work Email"
                            name="email"
                            type="email"
                            defaultValue={employee.email}
                            placeholder="sarah.johnson@company.com"
                            required
                        />

                        <div>
                            <label
                                htmlFor="role"
                                className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider mb-2"
                                style={{ color: "#9ca3af" }}
                            >
                                <ShieldCheck size={14} /> Role
                            </label>
                            <div className="relative">
                                <select
                                    id="role"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{
                                        background: "#1b1b29",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "#f3f4f6",
                                    }}
                                    className="w-full appearance-none rounded-lg pl-4 pr-10 py-3 text-sm
                                        focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                                >
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: "#6b7280" }}
                                />
                            </div>
                            <p
                                className={`text-xs mt-2 transition-opacity ${role === "admin" ? "opacity-100" : "opacity-70"}`}
                                style={{ color: role === "admin" ? "#c4b5fd" : "#6b7280" }}
                            >
                                {role === "admin"
                                    ? "Admins have full access to manage employees and settings."
                                    : "Employees can access their assigned tasks and profile only."}
                            </p>
                        </div>
                    </div>

                    <div
                        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#11111a" }}
                        className="px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3"
                    >
                        <Link
                            href="/dashboard/employees"
                            style={{ color: "#9ca3af" }}
                            className="order-2 sm:order-1 px-5 py-2.5 text-sm font-medium rounded-lg text-center
                                hover:bg-white/5 active:bg-white/10 transition-colors"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                background: submitting
                                    ? "#4c4c5c"
                                    : "linear-gradient(135deg, #7c3aed, #2563eb)",
                                boxShadow: submitting ? "none" : "0 8px 20px -6px rgba(124,58,237,0.5)",
                            }}
                            className="order-1 sm:order-2 inline-flex items-center justify-center gap-2
                                px-5 py-2.5 text-sm font-semibold text-white rounded-lg
                                transition-all active:scale-[0.98] disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Spinner /> Saving…
                                </>
                            ) : (
                                <>
                                    <Save size={16} strokeWidth={2.5} /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-xs mt-4 text-center sm:text-left" style={{ color: "#4b4d57" }}>
                    Password changes are managed separately from profile updates.
                </p>
            </div>
        </div>
    );
}

function Field({ icon, label, name, type, defaultValue, placeholder, required }) {
    return (
        <div>
            <label
                htmlFor={name}
                className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider mb-2"
                style={{ color: "#9ca3af" }}
            >
                {icon} {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                style={{
                    background: "#1b1b29",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#f3f4f6",
                }}
                className="w-full rounded-lg px-4 py-3 text-sm placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
            />
        </div>
    );
}

function Spinner() {
    return (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}
