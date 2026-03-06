import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const activeOnly = searchParams.get("active") === "true";
        const target = searchParams.get("target");
        const limit = parseInt(searchParams.get("limit") || "10");

        const where: any = {};
        if (activeOnly) where.isActive = true;
        if (target) where.target = { in: [target, "ALL"] };

        const announcements = await prisma.announcement.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        return NextResponse.json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { title, body, target, expiresAt } = await req.json();
        const userId = (session.user as any).id;

        if (!title || !body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                body,
                target: target || "ALL",
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                createdBy: userId,
            }
        });

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        console.error("Error creating announcement:", error);
        return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
    }
}
