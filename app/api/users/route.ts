import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");

        const where: any = {};
        if (role) where.role = role;

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                roomNumber: true,
                department: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    // This could also be /api/users/[id]
    // For simplicity, let's assume it's /api/users/route.ts for now or create the dynamic one
    return NextResponse.json({ error: "Not implemented. Use /api/users/[id]" }, { status: 501 });
}
