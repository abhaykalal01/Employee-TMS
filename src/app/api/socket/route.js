import { NextResponse } from "next/server";
import { initSocketServer } from "@/lib/socket";

export async function GET(request) {
    const server = request.headers.get("host") ? request : null;

    if (!server) {
        return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
}
