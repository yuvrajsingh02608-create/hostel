import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                hostelBlock: true,
                roomNumber: true,
                phone: true,
                createdAt: true,
                _count: {
                    select: {
                        complaints: true,
                        assignedTo: true,
                    }
                }
            }
        });

        return NextResponse.json(users);
    } catch (error: any) {
        console.error("GET /api/admin/users error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
