import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const category = searchParams.get("category");
        const priority = searchParams.get("priority");
        const agentId = searchParams.get("agentId");
        const userId = searchParams.get("userId");
        const limit = parseInt(searchParams.get("limit") || "100");
        
        const userRole = (session.user as any)?.role;
        const currentUserId = (session.user as any)?.id;

        const where: any = {};
        if (status) where.status = status;
        if (category) where.category = category;
        if (priority) where.priority = priority;

        // Filtering logic based on role
        if (userRole === "RESIDENT") {
            where.residentId = currentUserId;
        } else if (userRole === "AGENT") {
            if (agentId) where.agentId = agentId;
            // Additional logic for agents could go here
        } else if (userRole === "ADMIN") {
            if (userId) where.residentId = userId;
            if (agentId) where.agentId = agentId;
        }

        const complaints = await prisma.complaint.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                resident: {
                    select: { name: true, roomNumber: true }
                },
                agent: {
                    select: { name: true, department: true }
                },
                timeline: {
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        return NextResponse.json(complaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { title, description, category, priority, roomNumber, attachments } = await req.json();
        const userId = (session.user as any)?.id;
        const userName = session.user?.name || "Resident";
        const userRole = (session.user as any)?.role || "RESIDENT";

        if (!title || !description || !category || !roomNumber) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const complaint = await prisma.$transaction(async (tx) => {
            const newComplaint = await tx.complaint.create({
                data: {
                    title,
                    description,
                    category,
                    priority: priority || "NORMAL",
                    status: priority === "URGENT" ? "URGENT" : "OPEN",
                    roomNumber,
                    attachments: attachments || [],
                    residentId: userId,
                }
            });

            // Log initial timeline event
            await tx.timelineEvent.create({
                data: {
                    complaintId: newComplaint.id,
                    action: "SUBMITTED",
                    note: "Complaint successfully submitted",
                    actorId: userId,
                    actorName: userName,
                    actorRole: userRole,
                }
            });

            return newComplaint;
        });

        return NextResponse.json(complaint, { status: 201 });
    } catch (error) {
        console.error("Error creating complaint:", error);
        return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
    }
}
