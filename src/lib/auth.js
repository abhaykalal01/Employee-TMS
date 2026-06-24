import { getCurrentUser } from "./getCurrentUser";

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized. Please log in.");
    }
    return user;
}

export async function requireAdmin() {
    const user = await requireAuth();
    if (user.role !== "admin") {
        throw new Error("Forbidden. Admin access required.");
    }
    return user;
}
