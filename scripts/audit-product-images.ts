// scripts/audit-product-images.ts
import { VERIFIED_CATALOG, auditCatalog } from '../src/data/catalog';

console.log('====================================================');
console.log('🔍 VELORA CATALOG & IMAGE COHERENCE AUDIT');
console.log('====================================================');

const result = auditCatalog();

console.log(`\nAuditing ${VERIFIED_CATALOG.length} uniquely registered products...`);

let mismatchWarnings = 0;

VERIFIED_CATALOG.forEach((product) => {
  const title = product.title.toLowerCase();

  // Category consistency heuristics
  if (product.subcategory === 'Knitwear' && !title.includes('sweater') && !title.includes('knit') && !title.includes('cardigan') && !title.includes('polo') && !title.includes('top')) {
    console.warn(`⚠️ Warning: Potential mismatch for Knitwear item [${product.id}]: ${product.title}`);
    mismatchWarnings++;
  }
  if (product.category === 'Footwear' && !title.includes('shoes') && !title.includes('sneakers') && !title.includes('boots') && !title.includes('loafers') && !title.includes('heels') && !title.includes('sandals') && !title.includes('mules')) {
    console.warn(`⚠️ Warning: Potential mismatch for Footwear item [${product.id}]: ${product.title}`);
    mismatchWarnings++;
  }
  if (product.category === 'Bags' && !title.includes('bag') && !title.includes('tote') && !title.includes('clutch')) {
    console.warn(`⚠️ Warning: Potential mismatch for Bag item [${product.id}]: ${product.title}`);
    mismatchWarnings++;
  }
});

console.log('\n--- AUDIT SUMMARY ---');
console.log(`• Unique Product IDs Verified: ${new Set(VERIFIED_CATALOG.map(p => p.id)).size}`);
console.log(`• Unique Primary Images Verified: ${new Set(VERIFIED_CATALOG.map(p => p.image)).size}`);
console.log(`• Category Heuristic Warnings: ${mismatchWarnings}`);

if (result.valid && mismatchWarnings === 0) {
  console.log('\n✅ 100% AUDIT PASS: All product images, titles, and categories match with ZERO duplicates.');
  process.exit(0);
} else {
  console.error('\n❌ Audit flagged violations:');
  result.errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}