export function getSidebarItems(role) {
    if (role === "admin") {
        return [
            { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
            { href: "/dashboard/tasks", label: "Tasks", icon: "CheckSquare" },
            { href: "/dashboard/tasks/create", label: "Create Task", icon: "PlusCircle" },
            { href: "/dashboard/employees", label: "Employees", icon: "Users" },
            { href: "/dashboard/reports", label: "Reports", icon: "BarChart3" },
            { href: "/dashboard/settings/profile", label: "Profile", icon: "User" },
            { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
        ];
    }

    return [
        { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
        { href: "/dashboard/my-tasks", label: "My Tasks", icon: "CheckSquare" },
        { href: "/dashboard/settings/profile", label: "Profile", icon: "User" },
        { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
    ];
}
