import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, content } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                createdBy: session.user?.name || "Admin",
            }
        });

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        console.error("Error creating announcement:", error);
        return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: "desc" },
            take: 10
        });
        return NextResponse.json(announcements);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
    }
}
