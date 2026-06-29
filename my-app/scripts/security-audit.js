#!/usr/bin/env node

/**
 * Automated Security Audit Script
 * Runs npm audit and outdated checks, outputs JSON report
 * Can be integrated into CI/CD pipelines
 */

//poin checklist no 9

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../security-reports');
const REPORT_FILE = path.join(OUTPUT_DIR, `audit-${new Date().toISOString().split('T')[0]}.json`);

function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (error) {
    return error.stdout || error.stderr;
  }
}

function main() {
  console.log('🔍 Running security audit...\n');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Run npm audit
  console.log('📋 Checking for vulnerabilities...');
  const auditOutput = runCommand('npm audit --json');
  let auditData;
  try {
    auditData = JSON.parse(auditOutput);
  } catch (e) {
    auditData = { error: 'Failed to parse audit output' };
  }

  // Run npm outdated
  console.log('📦 Checking for outdated packages...');
  const outdatedOutput = runCommand('npm outdated --json');
  let outdatedData;
  try {
    outdatedData = JSON.parse(outdatedOutput);
  } catch (e) {
    outdatedData = {};
  }

  // Compile report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalVulnerabilities: auditData.metadata?.totalVulnerabilities || 0,
      critical: auditData.metadata?.vulnerabilities?.critical || 0,
      high: auditData.metadata?.vulnerabilities?.high || 0,
      moderate: auditData.metadata?.vulnerabilities?.moderate || 0,
      low: auditData.metadata?.vulnerabilities?.low || 0,
      outdatedPackages: Object.keys(outdatedData).length,
    },
    vulnerabilities: auditData.vulnerabilities || {},
    outdated: outdatedData,
    recommendations: generateRecommendations(auditData, outdatedData),
  };

  // Save report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`\n✅ Report saved to: ${REPORT_FILE}`);

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`   Vulnerabilities: ${report.summary.totalVulnerabilities}`);
  console.log(`   Critical: ${report.summary.critical}`);
  console.log(`   High: ${report.summary.high}`);
  console.log(`   Moderate: ${report.summary.moderate}`);
  console.log(`   Low: ${report.summary.low}`);
  console.log(`   Outdated packages: ${report.summary.outdatedPackages}`);

  // Exit with error code if critical/high vulnerabilities found
  if (report.summary.critical > 0 || report.summary.high > 0) {
    console.log('\n⚠️  Critical or high severity vulnerabilities found!');
    process.exit(1);
  }

  process.exit(0);
}

function generateRecommendations(auditData, outdatedData) {
  const recommendations = [];

  // Check for critical/high vulnerabilities
  if (auditData.metadata?.vulnerabilities?.critical > 0) {
    recommendations.push({
      severity: 'CRITICAL',
      message: 'Immediately fix critical vulnerabilities with npm audit fix --force',
    });
  }

  if (auditData.metadata?.vulnerabilities?.high > 0) {
    recommendations.push({
      severity: 'HIGH',
      message: 'Fix high severity vulnerabilities within 24 hours',
    });
  }

  // Check for outdated packages with security updates
  const securityUpdates = Object.entries(outdatedData)
    .filter(([name, info]) => {
      const wanted = info.wanted;
      const current = info.current;
      return wanted !== current;
    })
    .map(([name]) => name);

  if (securityUpdates.length > 0) {
    recommendations.push({
      severity: 'MEDIUM',
      message: `Update packages with security patches: ${securityUpdates.join(', ')}`,
    });
  }

  // Check for major version updates
  const majorUpdates = Object.entries(outdatedData)
    .filter(([name, info]) => {
      const currentMajor = info.current.split('.')[0];
      const latestMajor = info.latest.split('.')[0];
      return currentMajor !== latestMajor;
    })
    .map(([name, info]) => ({
      name,
      current: info.current,
      latest: info.latest,
    }));

  if (majorUpdates.length > 0) {
    recommendations.push({
      severity: 'INFO',
      message: `Major version updates available (may require testing): ${majorUpdates.map(u => `${u.name} (${u.current} → ${u.latest})`).join(', ')}`,
    });
  }

  return recommendations;
}

main();
