// Test IconPicker Integration
console.log('=== ICONPICKER INTEGRATION TEST ===\n');

const fs = require('fs');
const path = require('path');

const adminPage = fs.readFileSync(
  path.join(__dirname, 'app', 'admin', 'page.js'),
  'utf8'
);

// Test 1: Check ICON_KEY_REGEX is defined
console.log('TEST 1: ICON_KEY_REGEX defined');
const hasIconRegex = adminPage.includes('const ICON_KEY_REGEX = /^(icon)$/i');
console.log(hasIconRegex ? '✅ PASS' : '❌ FAIL');

// Test 2: Check detectFieldType returns 'icon' for icon fields
console.log('\nTEST 2: detectFieldType handles icon fields');
const hasIconDetection = adminPage.includes("if (ICON_KEY_REGEX.test(key)) return 'icon'");
console.log(hasIconDetection ? '✅ PASS' : '❌ FAIL');

// Test 3: Check LUCIDE_ICON_OPTIONS is defined
console.log('\nTEST 3: LUCIDE_ICON_OPTIONS defined');
const hasIconOptions = adminPage.includes('const LUCIDE_ICON_OPTIONS = [');
console.log(hasIconOptions ? '✅ PASS' : '❌ FAIL');

// Test 4: Check IconPicker component exists
console.log('\nTEST 4: IconPicker component exists');
const hasIconPicker = adminPage.includes('function IconPicker({value, onChange, label})');
console.log(hasIconPicker ? '✅ PASS' : '❌ FAIL');

// Test 5: Check form rendering handles icon fields
console.log('\nTEST 5: Form rendering handles icon fields');
const hasIconRender = adminPage.includes("fieldType === 'icon'");
console.log(hasIconRender ? '✅ PASS' : '❌ FAIL');

// Test 6: Check IconPicker is used in form
console.log('\nTEST 6: IconPicker is used in form');
const hasIconPickerUse = adminPage.includes('<IconPicker');
console.log(hasIconPickerUse ? '✅ PASS' : '❌ FAIL');

// Test 7: Check all Lucide icons from solution.json are in LUCIDE_ICON_OPTIONS
console.log('\nTEST 7: All solution.json icons in LUCIDE_ICON_OPTIONS');
const solutionData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'solution.json'), 'utf8'));
const icons = new Set();
solutionData.solutions.forEach(s => icons.add(s.icon));
solutionData.services.forEach(s => icons.add(s.icon));

let allIconsPresent = true;
icons.forEach(icon => {
  // Check with flexible spacing (with or without space after {)
  const pattern1 = `{name: '${icon}'`;
  const pattern2 = `{ name: '${icon}'`;
  if (!adminPage.includes(pattern1) && !adminPage.includes(pattern2)) {
    console.log(`   ❌ Missing icon: ${icon}`);
    allIconsPresent = false;
  }
});
console.log(allIconsPresent ? '✅ PASS' : '❌ FAIL');

// Test 8: Check validator accepts Lucide icons
console.log('\nTEST 8: Validator accepts Lucide icons');
const validator = fs.readFileSync(
  path.join(__dirname, 'lib', 'contentValidation.js'),
  'utf8'
);
const hasLucideValidator = validator.includes('isSafeLucideIcon') && validator.includes('ICON_KEYS');
console.log(hasLucideValidator ? '✅ PASS' : '❌ FAIL');

// Test 9: Check ErrorModal component exists
console.log('\nTEST 9: ErrorModal component exists');
const hasErrorModal = adminPage.includes('function ErrorModal({ error, onClose })');
console.log(hasErrorModal ? '✅ PASS' : '❌ FAIL');

// Test 10: Check doSave handles errors
console.log('\nTEST 10: doSave handles errors');
const hasErrorHandling = adminPage.includes('setErrorModal') && adminPage.includes('errorData');
console.log(hasErrorHandling ? '✅ PASS' : '❌ FAIL');

// Summary
console.log('\n=== SUMMARY ===');
const tests = [
  { name: 'ICON_KEY_REGEX', passed: hasIconRegex },
  { name: 'detectFieldType icon', passed: hasIconDetection },
  { name: 'LUCIDE_ICON_OPTIONS', passed: hasIconOptions },
  { name: 'IconPicker component', passed: hasIconPicker },
  { name: 'Form icon rendering', passed: hasIconRender },
  { name: 'IconPicker usage', passed: hasIconPickerUse },
  { name: 'All icons present', passed: allIconsPresent },
  { name: 'Validator support', passed: hasLucideValidator },
  { name: 'ErrorModal component', passed: hasErrorModal },
  { name: 'Error handling in doSave', passed: hasErrorHandling },
];

const passed = tests.filter(t => t.passed).length;
console.log(`Tests passed: ${passed}/${tests.length}\n`);

tests.forEach(test => {
  console.log(`${test.passed ? '✅' : '❌'} ${test.name}`);
});

if (passed === tests.length) {
  console.log('\n🎉 ALL TESTS PASSED! IconPicker implementation is complete.');
} else {
  console.log('\n⚠️ Some tests failed. Please review the implementation.');
}
