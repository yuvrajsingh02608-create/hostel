const { PrismaClient: PrismaPostgres } = require('./generated/postgres');
const { PrismaClient: PrismaMongo } = require('@prisma/client');

// This script expects two Prisma clients to exist.
// One generated for the OLD postgres schema, and one for the NEW mongo schema.

async function migrate() {
    const pg = new PrismaPostgres({
        datasources: { db: { url: "postgresql://postgres:password@127.0.0.1:5432/nivaasdesk" } }
    });
    const mongo = new PrismaMongo();

    console.log("Starting full migration...");

    try {
        // 1. Migrate Users
        const oldUsers = await pg.user.findMany();
        const userMap = new Map(); // oldId -> newId

        console.log(`Migrating ${oldUsers.length} users...`);
        for (const user of oldUsers) {
            const newUser = await mongo.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    hostelBlock: user.hostelBlock,
                    roomNumber: user.roomNumber,
                    phone: user.phone,
                    language: user.language,
                }
            });
            userMap.set(user.id, newUser.id);
        }

        // 2. Migrate Announcements
        const oldAnnouncements = await pg.announcement.findMany();
        console.log(`Migrating ${oldAnnouncements.length} announcements...`);
        for (const ann of oldAnnouncements) {
             await mongo.announcement.create({
                data: {
                    title: ann.title,
                    content: ann.content,
                    createdBy: ann.createdBy,
                    createdAt: ann.createdAt
                }
            });
        }

        // 3. Migrate Complaints
        const oldComplaints = await pg.complaint.findMany();
        const complaintMap = new Map(); // oldId -> newId

        console.log(`Migrating ${oldComplaints.length} complaints...`);
        for (const comp of oldComplaints) {
            const newComp = await mongo.complaint.create({
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

        // 4. Migrate TimelineEvents
        const oldTimeline = await pg.timelineEvent.findMany();
        console.log(`Migrating ${oldTimeline.length} timeline events...`);
        for (const event of oldTimeline) {
            if (complaintMap.has(event.complaintId)) {
                await mongo.timelineEvent.create({
                    data: {
                        complaintId: complaintMap.get(event.complaintId),
                        event: event.event,
                        actor: event.actor,
                        createdAt: event.createdAt
                    }
                });
            }
        }

        console.log("Full migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await pg.$disconnect();
        await mongo.$disconnect();
    }
}

migrate();
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
