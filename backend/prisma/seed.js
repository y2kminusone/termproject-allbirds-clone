import prisma from "../src/lib/prisma.js";

async function main() {
    await prisma.user.upsert({
        where: { email: "admin@allbirds.com" },
        update: {
            password: "admin123",
            role: "ADMIN",
            nickname: "Allbirds Admin",
            isActive: true,
        },
        create: {
            email: "admin@allbirds.com",
            password: "admin123",
            nickname: "Allbirds Admin",
            role: "ADMIN",
        },
    });
}

main()
    .then(() => {
        console.log("Seeded admin account (admin@allbirds.com / admin123)");
    })
    .catch((error) => {
        console.error("Seeding failed", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
