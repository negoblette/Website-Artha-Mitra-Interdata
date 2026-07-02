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

### Third-Party Resource Governance

Project ini memakai beberapa resource eksternal yang harus dikendalikan secara ketat agar tidak menambah risiko keamanan, terutama untuk CSP, embed, dan link pihak ketiga.

#### Allowed External Resources

| Resource | Type | Used In | Purpose | Runtime / Build-time |
|---|---|---|---|---|
| Google Maps Embed | iframe | [components/contact/ContactInfo.jsx](components/contact/ContactInfo.jsx#L154-L183) | Menampilkan lokasi kantor | Runtime |
| WhatsApp Link | link | [components/WhatsAppButton.jsx](components/WhatsAppButton.jsx#L3-L11), [components/home/ContactSection.jsx](components/home/ContactSection.jsx#L41-L49), [components/contact/ContactInfo.jsx](components/contact/ContactInfo.jsx#L113-L133) | Membuka chat WhatsApp | Runtime |
| Social Media Links | link | [components/Footer.jsx](components/Footer.jsx#L20-L23) | Navigasi ke media sosial resmi | Runtime |
| Google Fonts | font loader | [app/layout.js](app/layout.js#L1-L9) | Font UI application | Build-time |

#### Allowed Domains

Resource eksternal hanya boleh berasal dari domain berikut:

- `www.google.com`
- `maps.google.com`
- `wa.me`
- `www.facebook.com`
- `www.instagram.com`
- `www.linkedin.com`
- `arthamitra.co.id`
- `www.arthamitra.co.id`

#### CSP Enforcement

Content Security Policy harus selalu mengikuti daftar resource yang diizinkan di atas. Konfigurasi CSP utama ada di [next.config.mjs](next.config.mjs#L5-L19).

Aturan utama:
- `frame-src` hanya boleh berisi domain yang benar-benar dipakai untuk embed
- `script-src` tetap dibatasi ke `self` kecuali ada kebutuhan yang sudah direview
- resource baru tidak boleh ditambahkan ke CSP tanpa alasan yang jelas
- resource yang tidak ada dalam inventaris ini tidak boleh diaktifkan

#### Approval Process for New External Resources

Sebelum resource eksternal baru digunakan, langkah berikut harus dilakukan:

1. Identifikasi kebutuhan resource
2. Verifikasi bahwa resource memang diperlukan
3. Tambahkan resource ke inventaris ini
4. Perbarui CSP di [next.config.mjs](next.config.mjs#L5-L19) jika diperlukan
5. Uji resource di local development
6. Review hasilnya sebelum deploy

#### Prohibited External Resources

Resource berikut tidak boleh ditambahkan tanpa review keamanan:

- third-party script tracker
- widget chat pihak ketiga
- CDN JavaScript yang tidak jelas sumbernya
- embed dari domain yang tidak masuk allowlist
- inline script tambahan tanpa kebutuhan yang jelas
- resource yang meminta izin akses berlebihan

#### Review Checklist

Sebelum menambah resource eksternal baru, pastikan:

- resource benar-benar diperlukan
- domain sumber jelas dan terpercaya
- dampak ke CSP sudah dipahami
- tidak menambah attack surface yang tidak perlu
- resource diuji di local sebelum masuk production
- dokumentasi ini diperbarui setelah perubahan

#### Maintenance

Inventaris resource eksternal ini harus diperbarui setiap kali ada perubahan pada:
- komponen yang memakai link atau iframe eksternal
- CSP rules
- resource pihak ketiga baru
- font atau embed baru yang dipakai di aplikasi

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
