const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

async function main() {
    const data = {
        projectId: 3,
        itemDescription: 'GENERAL REQUIREMENTS',
        unit: 'lot',
        quantity: 1,
        isCarport: false,
        components: [
            { resourceType: 'MATERIAL', name: 'Mobilization & Demobilization', quantityFactor: 1, unitRate: 15000 },
            { resourceType: 'MATERIAL', name: 'Power consumption bills', quantityFactor: 3, unitRate: 2500 },
            { resourceType: 'MATERIAL', name: 'Water consumption bills', quantityFactor: 3, unitRate: 2000 }
        ]
    };

    console.log('--- SIMULATING UI CREATION ---');
    try {
        const components = data.components || [];
        const materialCosts = components
            .filter(c => c.resourceType === 'MATERIAL')
            .reduce((sum, c) => sum + (Number(c.quantityFactor) * Number(c.unitRate)), 0);

        const laborCosts = components
            .filter(c => c.resourceType === 'LABOR' || c.resourceType === 'EQUIPMENT')
            .reduce((sum, c) => sum + (Number(c.quantityFactor) * Number(c.unitRate)), 0);

        console.log('Calculated Costs:', { materialCosts, laborCosts });

        const newItem = await prisma.boqItem.create({
            data: {
                projectId: Number(data.projectId),
                itemDescription: data.itemDescription,
                unit: data.unit,
                quantity: Number(data.quantity),
                isCarport: data.isCarport || false,
                materialUnitPrice: materialCosts,
                laborUnitPrice: laborCosts,
                boqComponents: {
                    create: components.map(c => ({
                        resourceType: c.resourceType,
                        name: c.name,
                        quantityFactor: Number(c.quantityFactor),
                        unitRate: Number(c.unitRate),
                        totalComponentCost: Number(c.quantityFactor) * Number(c.unitRate)
                    }))
                }
            }
        });
        console.log('Successfully created item:', newItem.id);
    } catch (err) {
        console.error('FAILED:', err.message);
        if (err.stack) console.error(err.stack);
    } finally {
        await prisma.$disconnect();
    }
}

main();
