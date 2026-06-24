import { NextResponse } from "next/server";
import { getRoleFromToken } from "@/lib/jwt";

const ADMIN_ONLY_PREFIXES = [
    "/dashboard/employees",
    "/dashboard/reports",
];

const ADMIN_ONLY_EXACT = [
    "/dashboard/tasks/create",
];

const EMPLOYEE_BLOCKED_PREFIXES = [
    "/dashboard/tasks",
];

function isAdminOnlyPath(pathname) {
    if (ADMIN_ONLY_EXACT.includes(pathname)) {
        return true;
    }

    return ADMIN_ONLY_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
}

function isEmployeeBlockedFromTasks(pathname) {
    if (pathname === "/dashboard/my-tasks" || pathname.startsWith("/dashboard/my-tasks/")) {
        return false;
    }

    return EMPLOYEE_BLOCKED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
}

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const role = getRoleFromToken(token) || "employee";

        if (role !== "admin" && isAdminOnlyPath(pathname)) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        if (role !== "admin" && isEmployeeBlockedFromTasks(pathname)) {
            return NextResponse.redirect(new URL("/dashboard/my-tasks", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
