import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    const passwordHash = await bcrypt.hash('password123', 10)

    // Insert Users
    const userUpserts = [
        { email: 'admin@example.com', name: 'Admin User', role: 'ADMIN' },
        { email: 'encoder@example.com', name: 'Jane Encoder', role: 'ENCODER' },
        { email: 'purchaser@example.com', name: 'John Purchaser', role: 'PURCHASER' },
        { email: 'raymond@example.com', name: 'Sir Raymond', role: 'APPROVER' },
        { email: 'finance@example.com', name: 'Cash Disbursement', role: 'CASH_DISBURSEMENT' },
        { email: 'warehouse@example.com', name: 'Warehouse Manager', role: 'WAREHOUSE' },
        { email: 'engineer@example.com', name: 'Engr. Site', role: 'SITE_ENGINEER' },
    ]

    for (const u of userUpserts) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                password: passwordHash // Update password if user exists
            },
            create: {
                email: u.email,
                name: u.name,
                password: passwordHash,
                role: u.role as any,
            },
        })
    }

    // Insert Projects
    const project1 = await prisma.project.create({
        data: {
            name: 'Skyline Tower',
            location: 'Makati City',
            budget: 50000000.00,
            status: 'ACTIVE',
            boqItems: {
                create: [
                    { itemDescription: 'Portland Cement 40kg', unit: 'bags', materialUnitPrice: 250.00, quantity: 1000.00 },
                    { itemDescription: 'Steel Bar 10mm Grade 40', unit: 'pcs', materialUnitPrice: 180.00, quantity: 5000.00 },
                    { itemDescription: 'Concrete Hollow Blocks 4"', unit: 'pcs', materialUnitPrice: 15.00, quantity: 20000.00 },
                ]
            },
            inventory: {
                create: [
                    { materialName: 'Cement', quantity: 50.00, unit: 'bags' },
                    { materialName: 'Steel Bar 10mm', quantity: 100.00, unit: 'pcs' },
                ]
            }
        }
    })

    await prisma.project.create({
        data: {
            name: 'Seaside Villa',
            location: 'Batangas',
            budget: 15000000.00,
            status: 'ACTIVE',
            boqItems: {
                create: [
                    { itemDescription: 'Portland Cement 40kg', unit: 'bags', materialUnitPrice: 260.00, quantity: 500.00 },
                ]
            }
        }
    })

    // Suppliers
    await prisma.supplier.createMany({
        data: [
            { name: 'Hardware City', contactPerson: 'Mr. Tan', email: 'sales@hardwarecity.com' },
            { name: 'Steel Corp', contactPerson: 'Ms. Lee', email: 'orders@steelcorp.com' },
        ]
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
