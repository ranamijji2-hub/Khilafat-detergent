require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: 'Khilafat Detergent Powder',
    size: '50g',
    price: 20,
    image: '/images/products/khilafat-50g.webp',
    sortOrder: 1,
    featured: false,
    description:
      'Try-me size Khilafat Detergent Powder. Advance cleaning formula that lifts tough stains while staying gentle on fabric.',
  },
  {
    name: 'Khilafat Detergent Powder',
    size: '100g',
    price: 35,
    image: '/images/products/khilafat-100g.webp',
    sortOrder: 2,
    featured: false,
    description:
      'Compact 100g pack of Khilafat Detergent Powder with deep-cleaning formula and fresh long-lasting fragrance.',
  },
  {
    name: 'Khilafat Detergent Powder',
    size: '500g',
    price: 120,
    image: '/images/products/khilafat-500g.webp',
    sortOrder: 3,
    featured: true,
    description:
      'Our most popular household size. 500g of advance cleaning power — tough on stains and gentle on clothes.',
  },
  {
    name: 'Khilafat Detergent Powder',
    size: '1kg',
    price: 220,
    image: '/images/products/khilafat-1kg.webp',
    sortOrder: 4,
    featured: true,
    description:
      'The 1kg family pack. Removes tough stains, protects fabric colour, and is safe for the whole family.',
  },
  {
    name: 'Khilafat Detergent Powder',
    size: '5kg',
    price: 990,
    image: '/images/products/khilafat-5kg.webp',
    sortOrder: 5,
    featured: true,
    description:
      'Best value bulk pack. A month of advance cleaning power for your entire household.',
  },
];

const BANNERS = [
  {
    title: 'Khilafat Detergent',
    subtitle: 'Advance Cleaning Power For A Brighter & Cleaner Tomorrow',
    urduLine1: 'اب کپڑوں کے داغ چھپانا نہیں',
    urduLine2: 'انہیں جڑ سے ختم کرنا',
    image: '/images/brand/hero-pack.webp',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    sortOrder: 1,
    active: true,
  },
  {
    title: 'Available in 5 Sizes',
    subtitle: 'From 50g to 5kg — the right pack for every home',
    image: '/images/brand/hero-pack.webp',
    ctaText: 'View Products',
    ctaLink: '/products',
    sortOrder: 2,
    active: true,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: { username: adminUsername, passwordHash },
  });
  console.log(`✅ Admin user "${adminUsername}" ready`);

  // Products
  const { slugify } = await import('slugify').catch(() => ({ default: (s) => s.toLowerCase().replace(/\s+/g, '-') }));
  for (const product of PRODUCTS) {
    const slug = `${product.name.toLowerCase().replace(/\s+/g, '-')}-${product.size.toLowerCase()}`;
    await prisma.product.upsert({
      where: { slug },
      update: { ...product, slug },
      create: { ...product, slug },
    });
  }
  console.log(`✅ ${PRODUCTS.length} products seeded`);

  // Banners
  for (const banner of BANNERS) {
    const existing = await prisma.banner.findFirst({ where: { title: banner.title } });
    if (!existing) {
      await prisma.banner.create({ data: banner });
    }
  }
  console.log(`✅ Banners seeded`);

  // Default settings
  const existing = await prisma.setting.findUnique({ where: { id: 1 } });
  if (!existing) {
    await prisma.setting.create({ data: { id: 1, data: JSON.stringify({}) } });
    console.log('✅ Default settings created');
  }

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
