import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { users, complaints, timeline, announcements } = data;

        console.log("Starting import to MongoDB...");

        const userMap = new Map(); // oldId -> newId
        const complaintMap = new Map(); // oldId -> newId

        // 1. Import Users
        for (const user of users) {
             // Avoid duplicate emails
             const existing = await prisma.user.findUnique({ where: { email: user.email }});
             if (existing) {
                 userMap.set(user.id, existing.id);
                 continue;
             }

             const newUser = await prisma.user.create({
                 data: {
                     name: user.name,
                     email: user.email,
                     password: user.password,
                     role: user.role,
                     hostelBlock: user.hostelBlock,
                     roomNumber: user.roomNumber,
                     phone: user.phone,
                     language: user.language,
                     createdAt: user.createdAt
                 }
             });
             userMap.set(user.id, newUser.id);
        }

        // 2. Import Announcements
        for (const ann of announcements) {
            await prisma.announcement.create({
                data: {
                    title: ann.title,
                    content: ann.content,
                    createdBy: ann.createdBy,
                    createdAt: ann.createdAt
                }
            });
        }

        // 3. Import Complaints
        for (const comp of complaints) {
            const newComp = await prisma.complaint.create({
                data: {
                    title: comp.title,
                    description: comp.description,
                    category: comp.category,
                    priority: comp.priority,
                    status: comp.status,
                    location: comp.location,
                    attachments: comp.attachments,
                    residentId: userMap.get(comp.residentId),
                    agentId: comp.agentId ? userMap.get(comp.agentId) : null,
                    createdAt: comp.createdAt,
                    updatedAt: comp.updatedAt,
                    resolvedAt: comp.resolvedAt,
                }
            });
            complaintMap.set(comp.id, newComp.id);
        }

        // 4. Import TimelineEvents
        for (const event of timeline) {
            if (complaintMap.has(event.complaintId)) {
                await prisma.timelineEvent.create({
                    data: {
                        complaintId: complaintMap.get(event.complaintId),
                        event: event.event,
                        actor: event.actor,
                        createdAt: event.createdAt
                    }
                });
            }
        }

        return NextResponse.json({
            message: "Import completed successfully!",
            stats: {
                users: users.length,
                complaints: complaints.length,
                timeline: timeline.length,
                announcements: announcements.length
            }
        });
    } catch (error: any) {
        console.error("Import error:", error);
        return NextResponse.json({ 
            error: "Import failed. Make sure your DATABASE_URL in .env.local is pointing to the DESTINATION database (MongoDB).",
            details: error.message 
        }, { status: 500 });
    }
}
