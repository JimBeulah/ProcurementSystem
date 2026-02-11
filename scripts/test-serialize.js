const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

// Re-implementing serialize to test it
function serialize(data) {
    if (data === null || data === undefined) return data;
    if (data instanceof Date) return data;
    if (Array.isArray(data)) return data.map(item => serialize(item));
    if (typeof data === 'object') {
        // Decimal detection
        if (data.d && data.s && data.e !== undefined && typeof data.toNumber === 'function') {
            return data.toNumber();
        }
        const result = {};
        for (const [key, value] of Object.entries(data)) {
            result[key] = serialize(value);
        }
        return result;
    }
    return data;
}

async function main() {
    const projectId = 3;
    console.log('--- TESTING SERIALIZATION ---');
    try {
        const boqItems = await prisma.boqItem.findMany({
            where: { projectId: projectId },
            include: { boqComponents: true }
        });

        console.log(`Found ${boqItems.length} items. Attempting serialization...`);
        const result = serialize(boqItems);
        console.log('Serialization successful. Result length:', result.length);
        console.log('Example item components serialized:', result[result.length - 1].boqComponents.length);

    } catch (err) {
        console.error('SERIALIZATION FAILED:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
