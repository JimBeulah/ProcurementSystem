const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

async function main() {
    const projectId = 3;
    console.log('--- DB CHECK FOR PROJECT #3 ---');
    try {
        const items = await prisma.boqItem.findMany({
            where: { projectId: projectId },
            include: { boqComponents: true }
        });

        console.log('Total Items Found:', items.length);
        items.forEach(i => {
            console.log(`- [${i.id}] ${i.itemDescription} (${i.unit}) | Mat: ${i.materialUnitPrice} | Lab: ${i.laborUnitPrice}`);
            console.log(`  Components Found: ${i.boqComponents.length}`);
            i.boqComponents.forEach(c => {
                console.log(`    * ${c.name} | Type: ${c.resourceType} | Cost: ${c.totalComponentCost}`);
            });
        });
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
