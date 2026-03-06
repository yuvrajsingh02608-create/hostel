import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const csvContent = `ID,Title,Category,Status,Priority,Resident,Email,Agent,Created At
CD-8293,"WiFi connection issues",WIFI_INTERNET,OPEN,MEDIUM,"Yuvraj Singh",yuvraj@example.com,"Unassigned",2024-03-20T10:30:00Z
CD-8285,"Leaking faucet",MAINTENANCE,IN_PROGRESS,HIGH,"Aman Gupta",aman@example.com,"Unassigned",2024-03-19T14:45:00Z
`;

    return new NextResponse(csvContent, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": 'attachment; filename="complaints-report-demo.csv"',
        },
    });
}
