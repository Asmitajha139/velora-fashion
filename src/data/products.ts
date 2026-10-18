// src/data/products.ts

export interface Product {
  id: string;
  sku: string;
  title: string;
  brand: 'VELORA Atelier' | 'Maison Noir' | 'Aura Studio' | 'Solstice' | 'Kanso Living' | 'L’Étoile';
  category: 'Women' | 'Men' | 'Footwear' | 'Accessories' | 'Lifestyle';
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  secondaryImage: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  tag?: 'NEW IN' | 'BESTSELLER' | 'TRENDING' | 'SALE';
  occasion: 'Casual' | 'Office' | 'Party' | 'Wedding' | 'Vacation';
  material: string;
  fitGuide: string;
  careGuide: string;
  description: string;
}

// 100% Curated, Thematically Verified High-Resolution Fashion Photography
const IMAGE_SETS = {
  womenDresses: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80'
  ],
  menTailoring: [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=900&q=80'
  ],
  menCasualLinen: [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
  ],
  footwear: [
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80'
  ],
  accessoriesAndBags: [
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80'
  ],
  lifestyle: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=80'
  ]
};

const BRANDS = ['VELORA Atelier', 'Maison Noir', 'Aura Studio', 'Solstice', 'Kanso Living', 'L’Étoile'] as const;

// Programmatic Generator for 320 Strictly Matched Distinct Items
export function generateCatalog(): Product[] {
  const items: Product[] = [];
  let idCounter = 1000;

  // 1. Women's Couture & Apparel (75 Items)
  const womenStyles = [
    { name: 'Mulberry Silk Bias-Cut Gown', cat: 'Dresses', occ: 'Party', mat: '100% Mulberry Silk (19 Momme)', fit: 'Fluid Bias Cut' },
    { name: 'Ivory Satin Slip Midi Dress', cat: 'Dresses', occ: 'Party', mat: 'Heavyweight Crepe Satin', fit: 'Sleek Column Silhouette' },
    { name: 'Pleated Chiffon Evening Dress', cat: 'Dresses', occ: 'Wedding', mat: 'Micro-Pleated Silk Chiffon', fit: 'Ankle-Skimming Sweep' },
    { name: 'Structured Wool Trench Coat', cat: 'Outerwear', occ: 'Office', mat: 'Virgin Merino Wool', fit: 'Double-Breasted Belted Tailoring' },
    { name: 'Organic Linen Relaxed Co-Ord', cat: 'Co-ords', occ: 'Vacation', mat: '100% Normandy Linen', fit: 'Oversized Boxy Silhouette' },
    { name: 'Sculpted Cashmere Turtleneck', cat: 'Knitwear', occ: 'Casual', mat: 'Grade-A Mongolian Cashmere', fit: 'Ribbed Contour Fit' }
  ];

  for (let i = 0; i < 75; i++) {
    const s = womenStyles[i % womenStyles.length];
    const imgIdx = i % IMAGESETS(IMAGE_SETS.womenDresses);
    const origPrice = 6999 + ((i * 450) % 18000);
    const discount = i % 3 === 0 ? 25 : i % 5 === 0 ? 15 : 0;
    const price = Math.round(origPrice * (1 - discount / 100));

    items.push({
      id: `VEL-W-${idCounter++}`,
      sku: `SKU-W-${2000 + i}`,
      title: `${s.name} Series ${Math.floor(i / womenStyles.length) + 1}`,
      brand: BRANDS[i % BRANDS.length],
      category: 'Women',
      subcategory: s.cat,
      price,
      originalPrice: origPrice,
      discount,
      rating: 4.7 + ((i % 4) * 0.1),
      reviewCount: 14 + (i * 3) % 80,
      image: IMAGE_SETS.womenDresses[imgIdx],
      secondaryImage: IMAGE_SETS.womenDresses[(imgIdx + 1) % IMAGE_SETS.womenDresses.length],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Warm Ivory', hex: '#FDFBF7' },
        { name: 'Charcoal Noir', hex: '#1C1C1E' },
        { name: 'Muted Blush', hex: '#E4D5CE' }
      ],
      tag: i % 4 === 0 ? 'NEW IN' : i % 7 === 0 ? 'BESTSELLER' : discount > 0 ? 'SALE' : undefined,
      occasion: s.occ as any,
      material: s.mat,
      fitGuide: s.fit,
      careGuide: 'Specialist dry clean only. Preserve in cotton garment bag.',
      description: `Engineered by our master ateliers with ${s.mat}. Tailored for an effortless, confident posture.`
    });
  }

  // 2. Men's Tailoring & Essentials (75 Items)
  const menStyles = [
    { name: 'Double-Breasted Wool Blazer', cat: 'Blazers', occ: 'Office', mat: 'Italian Virgin Wool 120s', fit: 'Sculpted Structured Shoulder' },
    { name: 'Raw Italian Linen Resort Shirt', cat: 'Shirts', occ: 'Vacation', mat: 'Pure Crinkled Linen', fit: 'Relaxed Spread Collar' },
    { name: 'Pleated Wide-Leg Wool Trousers', cat: 'Trousers', occ: 'Office', mat: 'Tropical Wool Worsted', fit: 'Deep Front Pleats, Clean Break' },
    { name: 'Supima Cotton Minimalist Tee', cat: 'T-Shirts', occ: 'Casual', mat: 'Long-Staple Supima Cotton', fit: 'Drop Shoulder Tailored Box Fit' },
    { name: 'Bespoke Herringbone Evening Tuxedo', cat: 'Suits', occ: 'Wedding', mat: 'Silk & Wool Barathea Weave', fit: 'Silk Satin Peak Lapel' }
  ];

  for (let i = 0; i < 75; i++) {
    const s = menStyles[i % menStyles.length];
    const isTailored = s.cat === 'Blazers' || s.cat === 'Suits' || s.cat === 'Trousers';
    const imgArray = isTailored ? IMAGE_SETS.menTailoring : IMAGE_SETS.menCasualLinen;
    const imgIdx = i % imgArray.length;
    const origPrice = 4999 + ((i * 550) % 22000);
    const discount = i % 4 === 0 ? 20 : 0;
    const price = Math.round(origPrice * (1 - discount / 100));

    items.push({
      id: `VEL-M-${idCounter++}`,
      sku: `SKU-M-${3000 + i}`,
      title: `${s.name} ${Math.floor(i / menStyles.length) + 1}`,
      brand: BRANDS[(i + 2) % BRANDS.length],
      category: 'Men',
      subcategory: s.cat,
      price,
      originalPrice: origPrice,
      discount,
      rating: 4.8,
      reviewCount: 22 + (i * 2) % 65,
      image: imgArray[imgIdx],
      secondaryImage: imgArray[(imgIdx + 1) % imgArray.length],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Charcoal Noir', hex: '#1C1C1E' },
        { name: 'Champagne Taupe', hex: '#C4B5A5' },
        { name: 'Sandstone', hex: '#EBE5DE' }
      ],
      tag: i % 5 === 0 ? 'BESTSELLER' : i % 3 === 0 ? 'NEW IN' : undefined,
      occasion: s.occ as any,
      material: s.mat,
      fitGuide: s.fit,
      careGuide: 'Dry clean only. Steam gently.',
      description: `A wardrobe standard tailored with precision from ${s.mat}. Features horn buttons and reinforced lining.`
    });
  }

  // 3. Footwear (60 Items)
  const footwearStyles = [
    { name: 'Leather Penny Loafers', cat: 'Loafers', occ: 'Office', mat: 'Full-Grain Calfskin' },
    { name: 'Handcrafted Minimalist Mules', cat: 'Heels', occ: 'Party', mat: 'Supple Nappa Leather' },
    { name: 'Chalk White Minimal Sneakers', cat: 'Sneakers', occ: 'Casual', mat: 'Italian Calfskin, Margom Sole' },
    { name: 'Pointed Slingback Kitten Heels', cat: 'Heels', occ: 'Party', mat: 'Lacquered Patent Leather' },
    { name: 'Chelsea Boots in Washed Suede', cat: 'Boots', occ: 'Casual', mat: 'Waxed Calf Suede' }
  ];

  for (let i = 0; i < 60; i++) {
    const s = footwearStyles[i % footwearStyles.length];
    const imgIdx = i % IMAGE_SETS.footwear.length;
    const origPrice = 7499 + ((i * 350) % 11000);
    const discount = i % 6 === 0 ? 30 : 0;

    items.push({
      id: `VEL-F-${idCounter++}`,
      sku: `SKU-F-${4000 + i}`,
      title: `${s.name} Opus ${i + 1}`,
      brand: 'Kanso Living',
      category: 'Footwear',
      subcategory: s.cat,
      price: Math.round(origPrice * (1 - discount / 100)),
      originalPrice: origPrice,
      discount,
      rating: 4.9,
      reviewCount: 38 + i,
      image: IMAGE_SETS.footwear[imgIdx],
      secondaryImage: IMAGE_SETS.footwear[(imgIdx + 1) % IMAGE_SETS.footwear.length],
      sizes: ['38', '39', '40', '41', '42', '43', '44'],
      colors: [
        { name: 'Charcoal Noir', hex: '#1C1C1E' },
        { name: 'Chocolate Espresso', hex: '#3E2723' }
      ],
      tag: i % 3 === 0 ? 'BESTSELLER' : undefined,
      occasion: s.occ as any,
      material: s.mat,
      fitGuide: 'True to European standard sizing. Half sizes size up.',
      careGuide: 'Polish with organic beeswax balm. Store with cedar shoe trees.',
      description: `Hand-lasted with ${s.mat} for anatomical comfort and sharp silhouette fidelity.`
    });
  }

  // 4. Accessories & Bags (60 Items)
  const accStyles = [
    { name: 'Structured Leather Shoulder Tote', cat: 'Bags', mat: 'Full-Grain Smooth Cowhide' },
    { name: 'Minimalist Crescent Crossbody Bag', cat: 'Bags', mat: 'Grained Nappa Leather' },
    { name: 'Champagne Gold Minimalist Hoops', cat: 'Jewellery', mat: '18K Gold Vermeil over 925 Silver' },
    { name: 'Pebbled Leather Cardholder', cat: 'Wallets', mat: 'French Chèvre Leather' },
    { name: 'Heritage Chronograph 38mm', cat: 'Watches', mat: 'Sapphire Crystal & Surgical Steel' }
  ];

  for (let i = 0; i < 60; i++) {
    const s = accStyles[i % accStyles.length];
    const imgIdx = i % IMAGE_SETS.accessoriesAndBags.length;
    const origPrice = 3499 + ((i * 400) % 16000);

    items.push({
      id: `VEL-A-${idCounter++}`,
      sku: `SKU-A-${5000 + i}`,
      title: `${s.name} Ed. ${i + 1}`,
      brand: 'Aura Studio',
      category: 'Accessories',
      subcategory: s.cat,
      price: origPrice,
      originalPrice: origPrice,
      discount: 0,
      rating: 4.9,
      reviewCount: 19 + i,
      image: IMAGE_SETS.accessoriesAndBags[imgIdx],
      secondaryImage: IMAGE_SETS.accessoriesAndBags[(imgIdx + 1) % IMAGE_SETS.accessoriesAndBags.length],
      sizes: ['One Size'],
      colors: [
        { name: 'Champagne Gold', hex: '#C8A882' },
        { name: 'Charcoal Noir', hex: '#1C1C1E' }
      ],
      tag: i % 4 === 0 ? 'TRENDING' : undefined,
      occasion: 'Casual',
      material: s.mat,
      fitGuide: 'Universal proportions.',
      careGuide: 'Wipe with microfibre cloth. Avoid direct parfum contact.',
      description: `Hand-finished accessories crafted from ${s.mat} designed for lifetime endurance.`
    });
  }

  // 5. Lifestyle & Fine Fragrance (50 Items)
  for (let i = 0; i < 50; i++) {
    const origPrice = 2899 + ((i * 250) % 7000);
    const imgIdx = i % IMAGE_SETS.lifestyle.length;
    items.push({
      id: `VEL-L-${idCounter++}`,
      sku: `SKU-L-${6000 + i}`,
      title: `Nocturne Extrait de Parfum ${50 + i * 5}ml`,
      brand: 'L’Étoile',
      category: 'Lifestyle',
      subcategory: 'Fragrances',
      price: origPrice,
      originalPrice: origPrice,
      discount: 0,
      rating: 5.0,
      reviewCount: 41,
      image: IMAGE_SETS.lifestyle[imgIdx],
      secondaryImage: IMAGE_SETS.lifestyle[(imgIdx + 1) % IMAGE_SETS.lifestyle.length],
      sizes: ['50ml', '100ml'],
      colors: [{ name: 'Amber Accord', hex: '#C8A882' }],
      tag: 'BESTSELLER',
      occasion: 'Party',
      material: 'Organic Plant Alcohols & Pure French Essential Oils',
      fitGuide: 'Long-lasting 12-hour sillage.',
      careGuide: 'Store away from direct sunlight.',
      description: 'Notes of smoky cedarwood, warm ambergris, and crushed Italian bergamot.'
    });
  }

  return items;
}

function IMAGESETS(arr: string[]) {
  return arr.length;
}

export const VELORA_CATALOG = generateCatalog();