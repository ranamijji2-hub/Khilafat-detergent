import { prisma } from './prisma';

export const DEFAULT_SETTINGS = {
  siteName: 'Khilafat Detergent',
  companyName: 'RH & Sons',
  tagline: 'Advance Cleaning Power For A Brighter & Cleaner Tomorrow',
  logoUrl: '',
  contact: {
    address: 'Shah Jamal, Muzaffargarh, Punjab, Pakistan',
    phone: '+92 300 5344747',
    whatsapp: '+923005344747',
    email: 'info@rhasons.com',
    mapEmbedUrl:
      'https://www.google.com/maps?q=Shah+Jamal+Muzaffargarh+Pakistan&output=embed',
  },
  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
  },
  theme: {
    primary: '#0b3a8a',
    primaryDark: '#062357',
    secondary: '#1e88e5',
    accent: '#f2b705',
    ink: '#0c1b33',
    fontHeading: 'Poppins',
    fontBody: 'Nunito Sans',
  },
  seo: {
    titleTemplate: '%s | Khilafat Detergent — RH & Sons',
    defaultTitle: 'Khilafat Detergent | Premium Detergent Powder in Pakistan — RH & Sons',
    defaultDescription:
      'Khilafat Detergent by RH & Sons — advance cleaning power detergent powder available in 50g, 100g, 500g, 1kg and 5kg. Tough on stains, gentle on fabric, eco-friendly. Order online with Cash on Delivery across Pakistan.',
    keywords:
      'Khilafat Detergent, RH and Sons, Rhasons, detergent powder Pakistan, washing powder, Muzaffargarh detergent, best detergent powder Pakistan',
    ogImage: '',
  },
  about: {
    heading: 'About Khilafat Detergent',
    body:
      'Khilafat Detergent is a trusted name in the world of cleaning. Manufactured by RH & Sons, we are committed to providing high-quality detergent products that remove tough stains and give your clothes a long-lasting freshness, while staying gentle on fabric and safe for every member of the family.',
    mission:
      'To deliver premium-quality, affordable cleaning products to every household in Pakistan through advanced formulas and honest pricing.',
    foundedYear: '2018',
  },
  whyChooseUs: [
    { icon: 'flask', title: 'Advance Formula', text: 'Specially designed formula for deep cleaning.' },
    { icon: 'shirt', title: 'Protects Fabric', text: 'Keeps your clothes soft, fresh and new.' },
    { icon: 'leaf', title: 'Eco Friendly', text: 'Environment safe and biodegradable.' },
    { icon: 'badge', title: 'Premium Quality', text: 'Made with high quality ingredients.' },
  ],
  testimonials: [
    {
      name: 'Ayesha Khan',
      location: 'Multan',
      rating: 5,
      text: 'Khilafat Detergent removes the toughest stains in one wash. The fragrance lasts for days!',
    },
    {
      name: 'Bilal Ahmed',
      location: 'Muzaffargarh',
      rating: 5,
      text: 'Great value for money. The 5kg pack lasts our family a full month.',
    },
    {
      name: 'Sana Tariq',
      location: 'Multan',
      rating: 4,
      text: 'Gentle on my kids\u2019 clothes and very affordable. Delivery was fast too.',
    },
  ],
  faqs: [
    {
      question: 'Is Khilafat Detergent safe for all fabric types?',
      answer:
        'Yes. Khilafat Detergent is formulated to be tough on stains while remaining gentle and safe on cotton, lawn, denim and most everyday fabrics.',
    },
    {
      question: 'What sizes are available?',
      answer: 'Khilafat Detergent is available in 50g, 100g, 500g, 1kg and 5kg packs.',
    },
    {
      question: 'Do you deliver across Pakistan?',
      answer: 'Yes, we deliver nationwide with Cash on Delivery — no online payment required.',
    },
    {
      question: 'How can I place an order?',
      answer:
        'Add products to your cart and check out with your name, phone number and address, or simply order directly via WhatsApp.',
    },
  ],
  hero: {
    enabled: true,
  },
};

function deepMerge(base, override) {
  if (typeof override !== 'object' || override === null) return base;
  const result = Array.isArray(base) ? [...base] : { ...base };
  for (const key of Object.keys(override)) {
    if (
      typeof override[key] === 'object' &&
      override[key] !== null &&
      !Array.isArray(override[key]) &&
      typeof base?.[key] === 'object'
    ) {
      result[key] = deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

export async function getSettings() {
  try {
    let row = await prisma.setting.findUnique({ where: { id: 1 } });
    if (!row) {
      row = await prisma.setting.create({
        data: { id: 1, data: JSON.stringify(DEFAULT_SETTINGS) },
      });
    }
    const parsed = JSON.parse(row.data);
    return deepMerge(DEFAULT_SETTINGS, parsed);
  } catch (err) {
    // If the DB isn't reachable yet (e.g. first build before migration), fall back to defaults
    console.error('getSettings fallback:', err.message);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(partial) {
  const current = await getSettings();
  const merged = deepMerge(current, partial);
  await prisma.setting.upsert({
    where: { id: 1 },
    update: { data: JSON.stringify(merged) },
    create: { id: 1, data: JSON.stringify(merged) },
  });
  return merged;
}
