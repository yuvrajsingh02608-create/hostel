import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        console.log("Initializing MongoDB Atlas with fresh demo data...");
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create/Update Users
        const usersData = [
            { name: "Admin User", email: "admin@nivaas.com", role: "ADMIN" },
            { name: "Maintenance Hero", email: "agent@nivaas.com", role: "AGENT" },
            { name: "Yuvraj Singh", email: "resident@nivaas.com", role: "RESIDENT", hostelBlock: "A", roomNumber: "204", phone: "+91 98765 43210" },
        ];

        const users: any = {};
        for (const data of usersData) {
            users[data.role] = await prisma.user.upsert({
                where: { email: data.email },
                update: {
                    role: data.role as any,
                    password: hashedPassword,
                    name: data.name,
                    hostelBlock: data.hostelBlock,
                    roomNumber: data.roomNumber,
                    phone: data.phone,
                },
                create: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: data.role as any,
                    hostelBlock: data.hostelBlock,
                    roomNumber: data.roomNumber,
                    phone: data.phone,
                },
            });
        }

        // 2. Create Announcements
        await prisma.announcement.deleteMany({}); // Clear old ones
        await prisma.announcement.createMany({
            data: [
                { title: "Weekly Maintenance", content: "Water tank cleaning scheduled for Sunday morning.", createdBy: users.ADMIN.name },
                { title: "Internet Upgrade", content: "Block A will receive upgraded fiber routers tomorrow.", createdBy: users.ADMIN.name },
                { title: "Cultural Event", content: "Join us for the hostel night on Friday!", createdBy: users.ADMIN.name },
            ]
        });

        // 3. Create Sample Complaints
        await prisma.complaint.deleteMany({}); // Clear old ones
        await prisma.timelineEvent.deleteMany({});

        const complaintsData = [
            { 
                title: "WiFi connectivity issues", 
                description: "Signal is weak in Block A, Room 204. Disconnects frequently.",
                category: "WIFI_INTERNET",
                priority: "HIGH",
                status: "IN_PROGRESS",
                location: "Block A - Room 204",
                residentId: users.RESIDENT.id,
                agentId: users.AGENT.id
            },
            { 
                title: "Leaking tap in washroom", 
                description: "The tap in the 2nd-floor washroom is leaking continuously.",
                category: "MAINTENANCE",
                priority: "MEDIUM",
                status: "OPEN",
                location: "Block A - Floor 2",
                residentId: users.RESIDENT.id
            }
        ];

        for (const cData of complaintsData) {
            const complaint = await prisma.complaint.create({ data: cData as any });
            
            // Log initial event
            await prisma.timelineEvent.create({
                data: {
                    complaintId: complaint.id,
                    event: "Complaint submitted",
                    actor: users.RESIDENT.name,
                }
            });

            if (complaint.status === "IN_PROGRESS") {
                 await prisma.timelineEvent.create({
                    data: {
                        complaintId: complaint.id,
                        event: "Task assigned and work started",
                        actor: users.AGENT.name,
                    }
                });
            }
        }

        return NextResponse.json({
            message: "MongoDB Atlas initialized with fresh demo data successfully",
            users: Object.values(users).map((u: any) => ({ email: u.email, role: u.role })),
            password: password
        });
    } catch (error: any) {
        console.error("Setup error:", error);
        return NextResponse.json({ 
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
