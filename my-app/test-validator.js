const { validateContentPayload } = require('./lib/contentValidation');

console.log('=== VALIDATOR COMPREHENSIVE TEST ===\n');

// Test data that matches actual solution.json structure
const testData = {
  hero: {
    title: "Solutions & Services",
    subtitle: "IT Infrastructure & Security",
    description: "We deliver comprehensive solutions...",
    image: "/images/3C37485E00000578-0-image-a-29_1484690527135.jpg"
  },
  solutions: [
    {
      slug: "network-infrastructure",
      name: "Network Infrastructure",
      icon: "Network",  // Lucide icon name
      shortDescription: "Enterprise-grade network infrastructure...",
      fullDescription: "We design and implement robust networks...",
      features: ["LAN/WAN Design", "Network Assessment"],
      brands: [
        {
          name: "Juniper Networks",
          logo: "/images/principals/juniper.png",
          website: "https://www.juniper.net"
        }
      ]
    },
    {
      slug: "network-security",
      name: "Network Security",
      icon: "Zap",  // Another Lucide icon name
      shortDescription: "Layered network protection...",
      fullDescription: "We design network security architectures...",
      features: ["Next-Gen Firewall", "Threat Prevention"],
      brands: []
    },
    {
      slug: "cloud-security",
      name: "Cloud Security",
      icon: "Cloud",  // Another Lucide icon name
      shortDescription: "Protection for cloud workloads...",
      fullDescription: "We help organizations strengthen cloud security...",
      features: ["Cloud Threat Protection", "Workload Visibility"],
      brands: []
    }
  ],
  services: [
    {
      name: "Assessment",
      icon: "Search",  // Lucide icon name
      description: "Comprehensive evaluation..."
    },
    {
      name: "Design",
      icon: "PenTool",  // Lucide icon name
      description: "Custom architecture design..."
    },
    {
      name: "Implementation",
      icon: "Wrench",  // Lucide icon name
      description: "Professional deployment..."
    }
  ],
  whyChoose: {
    title: "Why Choose AMI?",
    description: "Our core focus...",
    points: [
      "Authorized partner",
      "Over two decades of experience"
    ]
  }
};

console.log('TEST 1: Valid Lucide icon names');
const result1 = validateContentPayload('solution', testData);
console.log('Result:', result1.ok ? '✅ PASSED' : '❌ FAILED');
if (!result1.ok) {
  console.log('Errors:', JSON.stringify(result1.errors, null, 2));
}
console.log('');

// Test with invalid icon
const testDataInvalidIcon = JSON.parse(JSON.stringify(testData));
testDataInvalidIcon.solutions[0].icon = "InvalidIcon123";

console.log('TEST 2: Invalid Lucide icon name');
const result2 = validateContentPayload('solution', testDataInvalidIcon);
console.log('Result:', result2.ok ? '❌ FAILED (expected)' : '✅ PASSED (caught invalid)');
if (!result2.ok) {
  console.log('Error message:', result2.errors[0].message);
}
console.log('');

// Test with image path for icon
const testDataIconAsImage = JSON.parse(JSON.stringify(testData));
testDataIconAsImage.solutions[0].icon = "/uploads/custom-icon.png";

console.log('TEST 3: Icon as image path');
const result3 = validateContentPayload('solution', testDataIconAsImage);
console.log('Result:', result3.ok ? '✅ PASSED (accepts image paths)' : '❌ FAILED');
console.log('');

// Test with actual data from solution.json
const actualSolutionData = require('./data/solution.json');

console.log('TEST 4: Actual solution.json data');
const result4 = validateContentPayload('solution', actualSolutionData);
console.log('Result:', result4.ok ? '✅ PASSED' : '❌ FAILED');
if (!result4.ok) {
  console.log('Number of errors:', result4.errors.length);
  console.log('First error:', result4.errors[0]);
}
console.log('');

// Summary
console.log('=== TEST SUMMARY ===');
const tests = [
  { name: 'Valid Lucide icons', passed: result1.ok },
  { name: 'Invalid Lucide icon caught', passed: !result2.ok },
  { name: 'Image paths accepted', passed: result3.ok },
  { name: 'Actual solution.json', passed: result4.ok },
];

const passed = tests.filter(t => t.passed).length;
console.log(`Tests passed: ${passed}/${tests.length}`);

tests.forEach(test => {
  console.log(`${test.passed ? '✅' : '❌'} ${test.name}`);
});
