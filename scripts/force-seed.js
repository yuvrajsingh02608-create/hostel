const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting forced seed for MongoDB Atlas...");
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const users = [
        { name: "Test Admin", email: "admin@nivaas.com", role: "ADMIN" },
        { name: "Test Agent", email: "agent@nivaas.com", role: "AGENT" },
        { name: "Test Resident", email: "resident@nivaas.com", role: "RESIDENT" },
    ];

    for (const userData of users) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: { 
                role: userData.role, 
                password: hashedPassword,
                name: userData.name
            },
            create: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: userData.role,
            },
        });
        console.log(`Updated/Created user: ${user.email} (${user.role})`);
    }
    console.log("Forced seed completed successfully on Atlas.");
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
