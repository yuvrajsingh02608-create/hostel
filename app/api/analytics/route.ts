import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({
        overview: {
            total: 482,
            open: 42,
            resolvedToday: 8
        },
        categories: [
            { category: "MAINTENANCE", _count: 156 },
            { category: "WIFI_INTERNET", _count: 92 },
            { category: "CLEANLINESS", _count: 114 },
            { category: "SECURITY", _count: 34 },
            { category: "FOOD", _count: 86 }
        ]
    });
}
