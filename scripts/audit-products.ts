import { VERIFIED_CATALOG, auditCatalog } from '../src/data/catalog';

console.log('--------------------------------------------------');
console.log('🔍 RUNNING VELORA PRODUCT CATALOG AUDIT & QA SUITE');
console.log('--------------------------------------------------');

const result = auditCatalog();

console.log(`Total Products Inspected: ${VERIFIED_CATALOG.length}`);

if (result.valid) {
  console.log('✅ AUDIT PASSED: 100% of product IDs, SKUs, and image URLs are unique.');
  console.log('✅ Zero duplicate images or repeated series detected.');
} else {
  console.error('❌ AUDIT FAILED: Duplication violations discovered:');
  result.errors.forEach((err) => console.error(`  - ${err}`));
  process.exit(1);
}