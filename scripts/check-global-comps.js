const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- GLOBAL COMPONENT CHECK ---');
    try {
        const comps = await prisma.boqItemComponent.findMany();
        console.log('Total Components in DB:', comps.length);
        comps.forEach(c => {
            console.log(`- [${c.id}] ${c.name} | Parent ID: ${c.boqItemId} | Cost: ${c.totalComponentCost}`);
        });

        const items = await prisma.boqItem.findMany();
        console.log('Total Items in DB:', items.length);
        items.forEach(i => console.log(`- [${i.id}] ${i.itemDescription}`));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
