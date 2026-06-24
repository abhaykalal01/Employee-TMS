export function getRoleFromToken(token) {
    if (!token) {
        return null;
    }

    try {
        const payload = token.split(".")[1];
        if (!payload) {
            return null;
        }

        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const decoded = JSON.parse(atob(padded));

        return decoded.role || null;
    } catch {
        return null;
    }
}
