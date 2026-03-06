import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        console.log("[FIX-AUTH] Starting forced recovery...");
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const usersData = [
            { name: "Admin User", email: "admin@nivaas.com", role: "ADMIN" },
            { name: "Maintenance Hero", email: "agent@nivaas.com", role: "AGENT" },
            { name: "Yuvraj Singh", email: "resident@nivaas.com", role: "RESIDENT" },
        ];

        const results = [];

        for (const data of usersData) {
            const user = await prisma.user.upsert({
                where: { email: data.email },
                update: {
                    password: hashedPassword,
                    role: data.role as any,
                },
                create: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    role: data.role as any,
                },
            });
            results.push({ email: user.email, role: user.role, status: "UPDATED/CREATED" });
        }

        return NextResponse.json({
            success: true,
            message: "Authentication data restored. Please try logging in with 'password123'.",
            results
        });
    } catch (error: any) {
        console.error("[FIX-AUTH] Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
