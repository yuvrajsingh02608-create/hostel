import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch all data from the current database
        const users = await prisma.user.findMany();
        const complaints = await prisma.complaint.findMany();
        const timeline = await prisma.timelineEvent.findMany();
        const announcements = await prisma.announcement.findMany();

        return NextResponse.json({
            users,
            complaints,
            timeline,
            announcements
        });
    } catch (error: any) {
        console.error("Export error:", error);
        return NextResponse.json({ 
            error: "Export failed. Make sure your DATABASE_URL in .env.local is pointing to the SOURCE database.",
            details: error.message 
        }, { status: 500 });
    }
}
