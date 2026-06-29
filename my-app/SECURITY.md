# Security Policy

## Dependency Management & Outdated Assets

This document outlines our security procedures for managing frontend assets and dependencies.

### Automated Security Monitoring

#### 1. GitHub Dependabot (Automated)
- **Schedule**: Daily checks at 09:00 WIB
- **Scope**: All npm dependencies
- **Behavior**:
  - Automatically creates PRs for security patches
  - Groups minor and patch updates together
  - Labels PRs as "dependencies" and "security"
  - Limits to 10 open PRs at a time

#### 2. GitHub Actions Security Audit (Scheduled)
- **Schedule**: Weekly (Monday at 09:00 UTC)
- **Also runs on**: Push to main/sakil-dev, Pull Requests to main
- **Checks performed**:
  - `npm audit` for known vulnerabilities
  - `npm outdated` for dependency version status
  - Custom security audit script
- **Outputs**:
  - Security audit report saved as artifact (30 days retention)
  - Fails CI if critical vulnerabilities are detected

### Manual Security Procedures

#### Local Development

Run security checks before committing:
```bash
# Check for vulnerabilities
npm run security:audit

# Check for outdated packages
npm run deps:outdated

# Generate detailed security report
npm run security:check

# Fix vulnerabilities automatically
npm run security:fix

# Force fix (may introduce breaking changes)
npm run security:fix:force
```

#### Production Deployment Checklist

Before deploying to production:
- [ ] Run `npm audit` and ensure no critical/high vulnerabilities
- [ ] Review Dependabot PRs and merge security updates
- [ ] Test updated packages in development environment
- [ ] Check for breaking changes in major version updates
- [ ] Update CHANGELOG with dependency changes

### Vulnerability Severity Levels

| Severity | Response Time | Action |
|----------|---------------|--------|
| **Critical** | Immediate | Block deployment, fix immediately |
| **High** | Within 24 hours | Fix before next release |
| **Moderate** | Within 1 week | Schedule for next sprint |
| **Low** | Within 1 month | Address when convenient |

### Dependency Update Strategy

#### Security Updates (Automated)
- **Minor/Patch versions**: Auto-merge after CI passes
- **Major versions**: Manual review required

#### Package Categories

**Core Framework** (test thoroughly before updating):
- next, react, react-dom

**UI/Animation** (usually safe updates):
- framer-motion, lucide-react, swiper

**Utilities** (low risk):
- nodemailer, otplib

**Build Tools** (update during development):
- tailwindcss, postcss, eslint

### Manual Review Process

For major version updates:
1. Review changelog for breaking changes
2. Check compatibility with other dependencies
3. Test in development environment
4. Update code if needed
5. Run full test suite
6. Deploy to staging
7. Verify in production-like environment

### Security Monitoring Commands

```bash
# Real-time vulnerability monitoring
npm audit --watch

# Check specific package for vulnerabilities
npm audit <package-name>

# View dependency tree
npm ls <package-name>

# Check package security score
npm audit --json | jq '.metadata'
```

### Reporting Security Issues

If you discover a security vulnerability:
1. Do NOT open a public GitHub issue
2. Email security@[yourdomain].com with details
3. Include: package name, version, vulnerability type, and reproduction steps
4. Allow 48 hours for initial response

### Resources

- [npm audit documentation](https://docs.npmjs.com/cli/audit)
- [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)

---

Last Updated: June 2026
