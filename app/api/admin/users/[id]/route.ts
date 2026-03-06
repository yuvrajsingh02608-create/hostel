import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { role } = await req.json();

        if (!role) {
            return NextResponse.json({ error: "Role is required" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: { role },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error updating user role:", error);
        return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }
}
