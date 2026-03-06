import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const agentId = searchParams.get("agentId");

        const userRole = (session.user as any)?.role;
        const currentUserId = (session.user as any)?.id;

        const where: any = {};
        if (userRole === "RESIDENT") {
            where.residentId = currentUserId;
        } else if (userRole === "AGENT") {
            where.agentId = currentUserId;
        } else if (userId) {
            where.residentId = userId;
        } else if (agentId) {
            where.agentId = agentId;
        }

        const [total, open, inProgress, resolved, urgent] = await Promise.all([
            prisma.complaint.count({ where }),
            prisma.complaint.count({ where: { ...where, status: "OPEN" } }),
            prisma.complaint.count({ where: { ...where, status: "IN_PROGRESS" } }),
            prisma.complaint.count({ where: { ...where, status: "RESOLVED" } }),
            prisma.complaint.count({ where: { ...where, status: "URGENT" } }),
        ]);

        // Add additional stats for Admin if needed
        let adminStats = {};
        if (userRole === "ADMIN") {
            const [totalUsers, activeAgents, registeredResidents] = await Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { role: "AGENT", isActive: true } }),
                prisma.user.count({ where: { role: "RESIDENT" } }),
            ]);
            adminStats = { totalUsers, activeAgents, registeredResidents };
        }

        return NextResponse.json({
            total,
            open,
            inProgress,
            resolved,
            urgent,
            ...adminStats
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
