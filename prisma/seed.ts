// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Parse DATABASE_URL from .env
const dbUrl = process.env.DATABASE_URL || "mysql://root:@localhost:3306/erp_system";
const match = dbUrl.match(/mysql:\/\/([^:@]+)(?::([^@]+))?@([^:]+):(\d+)\/(.+)/);

let prisma: PrismaClient;

if (match) {
  const adapter = new PrismaMariaDb({
    user: match[1],
    password: match[2] || "",
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  });
  prisma = new PrismaClient({ 
    adapter,
    log: ['error']
  });
} else {
  // Fallback to standard initialization
  prisma = new PrismaClient({
    log: ['error']
  });
}

async function main() {
  console.log('🌟 Seeding Premium Modern ERP Demo Data...\n');

  try {
    // 1. Create Organization
    const org = await prisma.organization.upsert({
      where: { slug: 'acme-corp' },
      update: {},
      create: {
        name: 'Acme Corporation',
        slug: 'acme-corp',
        email: 'hello@acmecorp.com',
        phone: '+880 1711-234567',
        address: 'Level 7, Gulshan Avenue, Dhaka 1212, Bangladesh',
        baseCurrency: 'BDT',
      },
    });
    console.log(`✅ Organization: ${org.name}`);

    // 2. Create Branches
    const branch1 = await prisma.branch.create({
      data: {
        organizationId: org.id,
        name: 'Unit-1 Spinning Mill',
        type: 'FACTORY',
        address: 'Gazipur, Bangladesh',
      }
    });
    const branch2 = await prisma.branch.create({
      data: {
        organizationId: org.id,
        name: 'Unit-2 Weaving Factory',
        type: 'FACTORY',
        address: 'Narayanganj, Bangladesh',
      }
    });
    console.log(`✅ Branches Created: Unit-1 and Unit-2`);

    // 3. Create Warehouses
    const whRaw = await prisma.warehouse.create({
      data: {
        organizationId: org.id,
        branchId: branch1.id,
        name: 'Raw Material Yard',
        warehouseType: 'RAW_MATERIAL',
        location: 'Gazipur Lot-A',
      }
    });
    const whWip = await prisma.warehouse.create({
      data: {
        organizationId: org.id,
        branchId: branch1.id,
        name: 'Yarn Store (WIP)',
        warehouseType: 'WIP',
        location: 'Gazipur Floor-2',
      }
    });
    const whFinished = await prisma.warehouse.create({
      data: {
        organizationId: org.id,
        branchId: branch2.id,
        name: 'Finished Fabric Rolls Store',
        warehouseType: 'FINISHED_GOODS',
        location: 'Narayanganj Lot-B',
      }
    });
    console.log(`✅ Warehouses Seeded`);

    // 4. Roles & Permissions
    const permissions = [
      { resource: 'dashboard', action: 'view' },
      { resource: 'product', action: 'create' },
      { resource: 'product', action: 'read' },
      { resource: 'product', action: 'update' },
      { resource: 'employee', action: 'read' },
      { resource: 'employee', action: 'create' },
      { resource: 'invoice', action: 'create' },
      { resource: 'report', action: 'read' },
      { resource: 'compliance', action: 'write' },
    ];

    const seededPermissions = [];
    for (const p of permissions) {
      const perm = await prisma.permission.upsert({
        where: { resource_action: { resource: p.resource, action: p.action } },
        update: {},
        create: p,
      });
      seededPermissions.push(perm);
    }

const adminRole = await prisma.role.upsert({
  where: { organizationId_name: { organizationId: org.id, name: 'Super Admin' } },
  update: {},
  create: { 
    organizationId: org.id,
    name: 'Super Admin', 
    description: 'Full system access', 
    isSystem: true 
  },
});

    // Link permissions to role
    for (const perm of seededPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: perm.id }
      });
    }
    console.log('✅ Roles & Permissions Seeded');

    // 5. Employees & Users
    const user1 = await prisma.user.upsert({
      where: { email: 'admin@acmecorp.com' },
      update: {},
      create: {
        email: 'admin@acmecorp.com',
        password: 'hashedpassword123', // Demo placeholder
        firstName: 'JYOT',
        lastName: 'PP',
        phone: '+880 1711-000111',
      }
    });

    await prisma.organizationUser.upsert({
      where: { organizationId_userId: { organizationId: org.id, userId: user1.id } },
      update: {},
      create: {
        organizationId: org.id,
        userId: user1.id,
        roleInOrg: 'OWNER',
      }
    });

    const emp1 = await prisma.employee.upsert({
      where: { employeeCode: 'EMP001' },
      update: {},
      create: {
        organizationId: org.id,
        userId: user1.id,
        branchId: branch1.id,
        roleId: adminRole.id,
        employeeCode: 'EMP001',
        firstName: 'JYOT',
        lastName: 'PP',
        email: 'admin@acmecorp.com',
        department: 'Management',
        designation: 'CTO / Admin',
        basicSalary: 185000,
        joinedAt: new Date('2024-01-10'),
      }
    });
    console.log('✅ Users & Employees Seeded');

    // 6. Customers & Suppliers
    const cust1 = await prisma.customer.upsert({
      where: { email: "contact@techvision.com" },
      update: {},
      create: { 
        organizationId: org.id,
        name: "TechVision Solutions Ltd", 
        email: "contact@techvision.com", 
        phone: "+880 1911-556677", 
        address: "Banani, Dhaka", 
        creditLimit: 500000 
      },
    });

    const sup1 = await prisma.supplier.upsert({
      where: { email: "sales@texspunyarns.co.in" },
      update: {},
      create: { 
        organizationId: org.id,
        name: "TexSpun Yarns Ltd", 
        email: "sales@texspunyarns.co.in", 
        phone: "+91 22 4910 2030", 
        address: "Gujarat, India",
        taxId: "TAX-IN-889",
        paymentTerms: "Net 30"
      },
    });

    const sup2 = await prisma.supplier.upsert({
      where: { email: "info@apexdyes.com" },
      update: {},
      create: { 
        organizationId: org.id,
        name: "Apex Dyes & Chemicals", 
        email: "info@apexdyes.com", 
        phone: "+880 2 9845522", 
        address: "Dhaka, Bangladesh",
        taxId: "TAX-BD-904",
        paymentTerms: "COD"
      },
    });
    console.log('✅ Customers & Suppliers Seeded');

    // 7. Fibers (Textile Inventory)
    const cottonFiber = await prisma.fiber.create({
      data: {
        organizationId: org.id,
        name: 'Organic Cotton fiber',
        fiberType: 'Cotton',
        grade: 'A',
        origin: 'India',
        micronaire: 4.2,
        staple: 28.5,
        reorderLevel: 2000,
      }
    });
    const polyFiber = await prisma.fiber.create({
      data: {
        organizationId: org.id,
        name: 'Polyester Staple fiber',
        fiberType: 'Polyester',
        grade: 'AA',
        origin: 'China',
        reorderLevel: 1000,
      }
    });

    // Fiber Lots
    const fiberLot1 = await prisma.fiberLot.create({
      data: {
        fiberId: cottonFiber.id,
        lotNumber: 'COT-IN-2026-01',
        supplierId: sup1.id,
        warehouseId: whRaw.id,
        quantityIn: 5000,
        quantityLeft: 3200,
        bags: 50,
      }
    });
    console.log('✅ Raw Fibers & Fiber Lots Seeded');

    // 8. Yarn Master & Yarn Lots
    const yarn1 = await prisma.yarnMaster.create({
      data: {
        organizationId: org.id,
        countValue: 30,
        countSystem: 'NE',
        ply: 1,
        blendRatio: '100% Cotton',
        yarnType: 'Combed',
        standardCostPerKg: 4.20,
      }
    });

    const yarnLot1 = await prisma.yarnLot.create({
      data: {
        yarnId: yarn1.id,
        lotNumber: 'YRN-30NE-001',
        warehouseId: whWip.id,
        quantityIn: 4000,
        quantityLeft: 4000,
        qualityGrade: 'A',
      }
    });
    console.log('✅ Yarn Master & Yarn Lots Seeded');

    // 9. Fabric Constructions & Rolls
    const fabric1 = await prisma.fabricConstruction.create({
      data: {
        organizationId: org.id,
        name: 'Premium Denim Fabric 14oz',
        weaveType: 'Twill',
        warpYarnId: yarn1.id,
        weftYarnId: yarn1.id,
        epi: 68,
        ppi: 42,
        width: 60.0,
        gsm: 380,
      }
    });

    // 10. Spinning & Weaving Resources
    const machine = await prisma.machine.create({
      data: {
        organizationId: org.id,
        branchId: branch1.id,
        name: 'Ring Frame #3',
        machineType: 'RING_FRAME',
        spindles: 480,
        capacityPerShift: 250,
      }
    });

    const loom = await prisma.loom.create({
      data: {
        organizationId: org.id,
        branchId: branch2.id,
        name: 'Loom #12',
        loomType: 'AIR_JET',
        width: 72.0,
      }
    });

    const roll1 = await prisma.fabricRoll.create({
      data: {
        fabricId: fabric1.id,
        rollNumber: 'ROLL-DENIM-01',
        warehouseId: whFinished.id,
        loomId: loom.id,
        lengthMeters: 120,
        weightKg: 45.5,
        qualityGrade: 'A',
      }
    });
    console.log('✅ Fabrics, Looms, and Rolls Seeded');

    // 11. Generic Products
    const products = [
      { name: "Premium Denim Fabric", sku: "TEX-DENIM-01", category: "Fabrics", price: 12.50, costPrice: 9.80, stockCount: 45, reorderLevel: 10, unit: "meters", organizationId: org.id },
      { name: "Organic Cotton Twill", sku: "TEX-COTTON-02", category: "Fabrics", price: 8.20, costPrice: 6.00, stockCount: 12, reorderLevel: 8, unit: "meters", organizationId: org.id },
      { name: "Recycled Polyester Yarn", sku: "TEX-POLY-03", category: "Yarns", price: 4.50, costPrice: 3.20, stockCount: 0, reorderLevel: 5, unit: "kg", organizationId: org.id },
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { sku: p.sku },
        update: {},
        create: p,
      });
    }
    console.log('✅ Products Catalog Seeded');

    // 12. Audit Logs & System Settings
    await prisma.auditLog.create({
      data: {
        userId: user1.id,
        action: 'UPDATE',
        resource: 'Product',
        resourceId: 'PRD-001',
        details: { durabilityScore: 8.5, recycledPercent: 40, change: 'Added AGEC compliance details' },
      }
    });
    await prisma.setting.create({
      data: {
        organizationId: org.id,
        key: 'UFLPA_BLOCK_XINJIANG',
        value: 'true',
      }
    });
    console.log('✅ System Logs & Settings Seeded');

    console.log('\n🎉 Premium demo seeding completed successfully!');

  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  });