export function getSidebarItems(role) {

    if (role === "admin") {

        return [

            {
                href: "/dashboard",
                label: "📊 Dashboard"
            },

            {
                href: "/dashboard/tasks",
                label: "✓ Tasks"
            },

            {
                href: "/dashboard/tasks/create",
                label: "➕ Create Task"
            },

            {
                href: "/dashboard/profile",
                label: "👤 Profile"
            },

            {
                href: "/dashboard/employees",
                label: "👥 Employees"
            },

            {
                href: "/dashboard/reports",
                label: "📈 Reports"
            },

            {
                href: "/dashboard/settings",
                label: "⚙️ Settings"
            }

        ];

    }

    return [

        {
            href: "/dashboard",
            label: "📊 Dashboard"
        },

        {
            href: "/dashboard/tasks",
            label: "✓ My Tasks"
        },

        {
            href: "/dashboard/profile",
            label: "👤 Profile"
        },

        {
            href: "/dashboard/settings",
            label: "⚙️ Settings"
        }

    ];

}