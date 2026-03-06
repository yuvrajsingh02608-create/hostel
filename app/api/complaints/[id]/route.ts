import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const complaint = await prisma.complaint.findUnique({
            where: { id: params.id },
            include: {
                resident: {
                    select: { name: true, email: true, roomNumber: true }
                },
                agent: {
                    select: { name: true, email: true, department: true }
                },
                timeline: {
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!complaint) {
            return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
        }

        return NextResponse.json(complaint);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { status, agentId, resolutionNote, internalNote, priority } = body;
        const userId = (session.user as any).id;
        const userName = session.user?.name || "User";
        const userRole = (session.user as any).role;

        const complaint = await prisma.complaint.findUnique({
            where: { id: params.id },
        });

        if (!complaint) {
            return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
        }

        const oldStatus = complaint.status;

        const updatedComplaint = await prisma.$transaction(async (tx) => {
            const updated = await tx.complaint.update({
                where: { id: params.id },
                data: {
                    ...(status && { status }),
                    ...(agentId && { agentId }),
                    ...(resolutionNote && { resolutionNote }),
                    ...(internalNote && { internalNote }),
                    ...(priority && { priority }),
                },
            });

            // Log timeline events for changes
            if (status && status !== oldStatus) {
                await tx.timelineEvent.create({
                    data: {
                        complaintId: params.id,
                        action: `STATUS_CHANGED`,
                        note: `Status updated from ${oldStatus} to ${status}`,
                        actorId: userId,
                        actorName: userName,
                        actorRole: userRole,
                    }
                });
            }

            if (agentId && agentId !== complaint.agentId) {
                const agent = await tx.user.findUnique({ where: { id: agentId }, select: { name: true } });
                await tx.timelineEvent.create({
                    data: {
                        complaintId: params.id,
                        action: `AGENT_ASSIGNED`,
                        note: agent ? `Assigned to ${agent.name}` : `Agent assignment updated`,
                        actorId: userId,
                        actorName: userName,
                        actorRole: userRole,
                    }
                });
            }

            if (resolutionNote) {
                await tx.timelineEvent.create({
                    data: {
                        complaintId: params.id,
                        action: `RESOLVED`,
                        note: resolutionNote,
                        actorId: userId,
                        actorName: userName,
                        actorRole: userRole,
                    }
                });
            }

            return updated;
        });

        return NextResponse.json(updatedComplaint);
    } catch (error) {
        console.error("PATCH /api/complaints/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        await prisma.complaint.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
