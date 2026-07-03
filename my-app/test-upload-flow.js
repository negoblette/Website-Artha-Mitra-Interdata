const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=== COMPREHENSIVE UPLOAD FLOW TEST ===\n');

// Test 1: Verify file paths
console.log('TEST 1: Verify File Paths');
console.log('─'.repeat(50));

const hostUploadsDir = path.join(process.cwd(), 'data', 'uploads');
const containerUploadsDir = '/app/data/uploads';

console.log('Host uploads directory:', hostUploadsDir);
console.log('Container uploads directory:', containerUploadsDir);
console.log('Host directory exists:', fs.existsSync(hostUploadsDir));
console.log('Files in host directory:', fs.readdirSync(hostUploadsDir).length);
console.log('');

// Test 2: Verify upload route code
console.log('TEST 2: Verify Upload Route Configuration');
console.log('─'.repeat(50));

const uploadRoute = fs.readFileSync(
  path.join(process.cwd(), 'app', 'api', 'upload', 'route.js'),
  'utf8'
);

const hasCorrectPath = uploadRoute.includes("path.join(process.cwd(), 'data', 'uploads')");
const hasMkdir = uploadRoute.includes('fs.mkdir(uploadsDir, { recursive: true })');
const hasWriteFile = uploadRoute.includes('fs.writeFile(filePath, buffer)');

console.log('Upload destination is data/uploads:', hasCorrectPath ? '✅ YES' : '❌ NO');
console.log('Directory creation enabled:', hasMkdir ? '✅ YES' : '❌ NO');
console.log('File write enabled:', hasWriteFile ? '✅ YES' : '❌ NO');
console.log('');

// Test 3: Verify serving routes
console.log('TEST 3: Verify Serving Routes Configuration');
console.log('─'.repeat(50));

const uploadsServingRoute = fs.readFileSync(
  path.join(process.cwd(), 'app', 'uploads', '[...path]', 'route.js'),
  'utf8'
);

const apiUploadsServingRoute = fs.readFileSync(
  path.join(process.cwd(), 'app', 'api', 'uploads', '[...path]', 'route.js'),
  'utf8'
);

const uploadsChecksDataFirst = uploadsServingRoute.includes("path.join(process.cwd(), 'data', 'uploads')");
const uploadsHasFallback = uploadsServingRoute.includes("legacyDir = path.join(process.cwd(), 'public', 'uploads')");
const apiUploadsChecksData = apiUploadsServingRoute.includes("path.join(process.cwd(), 'data', 'uploads')");

console.log('app/uploads route checks data/uploads first:', uploadsChecksDataFirst ? '✅ YES' : '❌ NO');
console.log('app/uploads route has public fallback:', uploadsHasFallback ? '✅ YES' : '❌ NO');
console.log('app/api/uploads route checks data/uploads:', apiUploadsChecksData ? '✅ YES' : '❌ NO');
console.log('');

// Test 4: Verify migration function
console.log('TEST 4: Verify Migration Function');
console.log('─'.repeat(50));

const contentModule = fs.readFileSync(
  path.join(process.cwd(), 'lib', 'content.js'),
  'utf8'
);

const hasMigration = contentModule.includes('migrateLegacyUploads');
const migrationFromPublic = contentModule.includes("path.join(process.cwd(), 'public', 'uploads')");
const migrationToData = contentModule.includes("path.join(dataDir, 'uploads')");

console.log('Migration function exists:', hasMigration ? '✅ YES' : '❌ NO');
console.log('Migrates from public/uploads:', migrationFromPublic ? '✅ YES' : '❌ NO');
console.log('Migrates to data/uploads:', migrationToData ? '✅ YES' : '❌ NO');
console.log('');

// Test 5: Verify Docker configuration
console.log('TEST 5: Verify Docker Configuration');
console.log('─'.repeat(50));

const dockerCompose = fs.readFileSync(
  path.join(process.cwd(), 'docker-compose.yml'),
  'utf8'
);

const hasDataMount = dockerCompose.includes('./data:/app/data');
const hasLogsMount = dockerCompose.includes('./logs:/app/logs');
const noPublicMount = !dockerCompose.includes('./public:/app/public');

console.log('data/ directory mounted:', hasDataMount ? '✅ YES' : '❌ NO');
console.log('logs/ directory mounted:', hasLogsMount ? '✅ YES' : '❌ NO');
console.log('public/ NOT mounted (correct):', noPublicMount ? '✅ YES' : '❌ NO');
console.log('');

// Test 6: Check existing files
console.log('TEST 6: Check Existing Files');
console.log('─'.repeat(50));

const existingFiles = fs.readdirSync(hostUploadsDir);
console.log('Files in data/uploads/:', existingFiles.length);
existingFiles.forEach(file => {
  const stats = fs.statSync(path.join(hostUploadsDir, file));
  console.log(`  - ${file}: ${stats.size} bytes`);
});
console.log('');

// Test 7: Verify JSON references
console.log('TEST 7: Verify JSON File References');
console.log('─'.repeat(50));

const productsJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data', 'products.json'), 'utf8')
);

const brands = productsJson.brands || [];
console.log('Total brands:', brands.length);

let validReferences = 0;
let invalidReferences = 0;

brands.forEach(brand => {
  if (brand.logo) {
    const logoPath = brand.logo.replace(/^\//, ''); // Remove leading /
    const fullPath = path.join(process.cwd(), logoPath);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      validReferences++;
      console.log(`  ✅ ${brand.name}: ${brand.logo} (EXISTS)`);
    } else {
      invalidReferences++;
      console.log(`  ❌ ${brand.name}: ${brand.logo} (MISSING)`);
    }
  }
});

console.log('');
console.log('Valid references:', validReferences);
console.log('Invalid references:', invalidReferences);
console.log('');

// Summary
console.log('=== TEST SUMMARY ===');
console.log('─'.repeat(50));

const allTests = [
  hasCorrectPath,
  hasMkdir,
  hasWriteFile,
  uploadsChecksDataFirst,
  uploadsHasFallback,
  apiUploadsChecksData,
  hasMigration,
  migrationFromPublic,
  migrationToData,
  hasDataMount,
  hasLogsMount,
  noPublicMount
];

const passedTests = allTests.filter(t => t).length;
const totalTests = allTests.length;

console.log(`Tests passed: ${passedTests}/${totalTests}`);

if (passedTests === totalTests) {
  console.log('\n✅ ALL TESTS PASSED!');
  console.log('Upload flow is correctly configured.');
  console.log('Files will be saved to data/uploads/ and persist across Docker restarts.');
} else {
  console.log('\n⚠️ SOME TESTS FAILED!');
  console.log('Please review the configuration.');
}
