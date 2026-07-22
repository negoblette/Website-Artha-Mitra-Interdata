# Artha Mitra Interdata Website Documentation

**Project:** `my-app`

**Purpose:** This document describes the website architecture, content model, admin workflow, API surface, and operational setup for the Artha Mitra Interdata site.

## 1. Project overview

Artha Mitra Interdata is a Next.js App Router application that presents the company profile, solutions, products, activities, insight content, and contact information. The site is driven by JSON content files rather than a database, which keeps the public pages and the admin CMS flow simple to maintain.

The application is designed around a small set of reusable principles:

- Public pages render from shared JSON data in `my-app/data/`.
- The admin area edits the same JSON content through a CMS-like UI.
- Backups are created automatically before writes.
- Route updates are revalidated after content changes.
- Uploaded media is stored on disk and served back through a dedicated route.

## 2. Technology stack

Core runtime and UI technologies:

- Next.js 16 with the App Router
- React 19
- Tailwind CSS 4
- Framer Motion for animation
- Lucide React for icons
- Swiper for carousel-style UI
- Redis for admin session and rate-limit state
- Node.js runtime for server routes that need filesystem access

Project scripts in `my-app/package.json` include:

- `dev` for local development
- `build` for production build
- `start` for serving the build
- `lint` for ESLint
- `security:audit`, `security:check`, and related security maintenance scripts

The repository also includes `my-app/docker-compose.yml`, which starts Redis and the web application together.

## 3. Repository structure

The main folders that matter for documentation and maintenance are:

- `my-app/app/` — routes, layouts, and API endpoints
- `my-app/components/` — shared UI and section components
- `my-app/data/` — JSON content source of truth
- `my-app/lib/` — content helpers, auth, validation, logging, and request utilities
- `my-app/public/` — public assets and file-serving paths
- `my-app/docs/` — documentation source files
- `my-app/scripts/` — maintenance and generation scripts
- `my-app/data/uploads/` — uploaded media stored on disk
- `my-app/data/backups/` — automatic JSON backups

A legacy upload directory under `my-app/public/uploads/` can still be read by the upload-serving route for compatibility.

## 4. Application shell and global layout

The root layout is defined in `my-app/app/layout.js`.

Responsibilities of the shell:

- load the global data through `getContent('global')`
- apply the Sora font from `next/font/google`
- wrap the page inside `LayoutShell`
- set basic metadata for the site

`my-app/components/LayoutShell.jsx` provides the shared site frame:

- renders the navbar and footer for public pages
- hides the public shell on `/admin`
- adds scroll reveal animation to page sections
- shows the WhatsApp floating action button when configured

Shared chrome components:

- `my-app/components/Navbar.jsx`
- `my-app/components/Footer.jsx`
- `my-app/components/WhatsAppButton.jsx`
- `my-app/components/AnimatedSection.jsx`

## 5. Public route map

Public pages and their main responsibilities:

- `/` — homepage with hero, explanation, offerings, testimonials, news, and contact section
- `/about` — company profile, vision, mission, core values, history, achievements, and careers
- `/solution` — solutions landing page with solution grid, services, and key differentiators
- `/solution/[slug]` — dynamic solution detail page for each solution entry
- `/products` — partner/vendor page and products carousel
- `/activities` — programs and events page
- `/insight` — articles and news hub
- `/contact` — contact page with company details and map/contact information
- `/admin` — CMS editing interface

Important supporting API and asset routes:

- `/api/content`
- `/api/backups`
- `/api/upload`
- `/api/uploads/[...path]`
- `/api/solutions`
- `/api/brands`
- `/api/master-list`
- `/api/auth/start`
- `/api/auth/verify`
- `/api/auth/me`
- `/api/auth/logout`

## 6. Page-by-page behavior

### Home page

`my-app/app/page.js` loads `homepage` and `global` data, resolves content references, and renders these sections:

- `HeroSection`
- `HowItWorksSection`
- `OfferingsSection`
- `TestimonialsSection`
- `NewsSection`
- `ContactSection`
- `WhatsAppButton` when a WhatsApp number exists

The homepage is the clearest example of the site’s reference-based content model.

### About page

`my-app/app/about/page.js` uses the data in `about.json` to render the company story and people-focused content:

- hero
- vision and mission
- core values
- history timeline
- achievements
- life at AMI
- careers

### Solution landing page

`my-app/app/solution/page.js` renders:

- `SolutionHero`
- `SolutionGrid`
- `ServicesGrid`
- `WhyChoose`

### Solution detail page

`my-app/app/solution/[slug]/page.js` is a statically generated dynamic route.

Key behavior:

- `generateStaticParams()` builds paths from `solution.json`
- `generateMetadata()` sets per-solution title and description
- invalid slugs return `notFound()`
- the page passes solution data to `SolutionDetailClient`

### Products page

`my-app/app/products/page.js` presents vendor/partner information from `products.json`.

### Activities page

`my-app/app/activities/page.js` renders program and event content from `activities.json`.

### Insight page

`my-app/app/insight/page.js` displays articles and news entries from `insight.json`.

### Contact page

`my-app/app/contact/page.js` uses the global contact data and contact-related sections to provide address, phone, email, and map details.

## 7. Shared data model

The site uses JSON files in `my-app/data/` as the source of truth.

### `global.json`

Contains global values used across the site:

- company name
- tagline
- logo path
- WhatsApp number
- navigation items
- footer content
- contact information

### `homepage.json`

Contains the homepage content structure:

- hero section
- how-it-works section
- offerings and tabs
- testimonials
- news section
- contact CTA section

The homepage includes reference objects with `_ref` metadata so content can be linked to records from other files.

### `about.json`

Contains:

- hero
- vision
- mission
- core values
- history and milestones
- achievements
- life-at-AMI gallery
- careers and job listings

### `solution.json`

Contains:

- hero
- solution records with slug, icon, descriptions, features, and brands
- service records
- why-choose section

### `products.json`

Contains:

- hero
- brand/vendor cards
- carousel images
- brand-to-solution relationships

### `activities.json`

Contains:

- hero
- programs
- events

### `insight.json`

Contains:

- hero
- articles
- news items

## 8. Content helpers and reference resolution

The primary content helper lives in `my-app/lib/content.js`.

Its responsibilities include:

- loading JSON from disk with `getContent()`
- writing updated JSON with `updateContent()`
- updating a single section with `updateSection()`
- creating backups with `backupContent()`
- listing backups with `listBackups()`
- restoring backups with `restoreBackup()`
- pruning old backups with `purgeOldBackups()`

Data initialization behavior:

- if the data directory is empty, seed files can be copied from `data-init/`
- legacy uploads can be migrated from `public/uploads/` to `data/uploads/`

Reference resolution is handled through `my-app/lib/referenceResolver` and is used when the homepage stores cross-file references instead of duplicating content.

## 9. Admin CMS workflow

The admin interface is implemented in `my-app/app/admin/page.js` with a minimal layout in `my-app/app/admin/layout.js`.

The editor supports:

- login with password + TOTP
- page-by-page content editing
- diff preview before saving
- automatic backups before write
- backup history and restore
- image upload for supported fields
- array editing with add, duplicate, reorder, and delete actions
- master list pickers for linked content

The editor is designed to modify the same JSON files that the public pages render from, so the public site can update without a separate database or CMS backend.

### Admin state and safety behavior

The admin editor preserves certain fields as read-only for some pages so important nested sections do not get overwritten accidentally.

The editor also normalizes some homepage array shapes before editing so content remains consistent.

## 10. Admin authentication and permissions

Authentication is handled by the auth API routes:

- `POST /api/auth/start` checks the password and creates the OTP challenge
- `POST /api/auth/verify` verifies the TOTP code and creates the session
- `GET /api/auth/me` checks whether a valid session exists
- `POST /api/auth/logout` clears the session

Security controls in this flow include:

- admin host restriction
- rate limiting on repeated attempts
- TOTP-based second factor
- server-side session validation
- signed cookies with secure attributes in production

The auth flow uses Redis-backed session state.

## 11. Content API behavior

`my-app/app/api/content/route.js` is the main content API for the admin editor.

GET behavior:

- validates the requested file name
- checks admin authentication
- optionally resolves references when `resolveRefs=true`
- returns the JSON data for the requested file

PUT behavior:

- validates the requested file name
- checks admin authentication
- rate limits writes
- validates the content payload
- preserves read-only paths for some sections
- creates a backup before writing
- saves the JSON to disk
- logs the update
- revalidates the affected public routes
- revalidates solution detail pages when solution data changes

This route is the bridge between the editor and the public site.

## 12. Backup and restore flow

`my-app/app/api/backups/route.js` manages restore history.

GET behavior:

- returns the list of backups for a content file
- newest backup is returned first

POST behavior:

- validates the backup file name
- restores the chosen backup
- creates a safety backup before restore
- revalidates affected routes
- prunes old backups after the restore

Backups are capped so the content folder does not grow without bound.

## 13. Upload and static file serving

`my-app/app/api/upload/route.js` accepts image uploads for the CMS.

Upload safety checks include:

- authentication
- rate limiting
- max file size enforcement
- MIME type restriction to PNG/JPG
- magic-byte validation so the binary content matches the declared type

Uploaded files are written to `my-app/data/uploads/` and returned as `/uploads/...` URLs.

`my-app/app/uploads/[...path]/route.js` serves uploaded assets and legacy upload assets with a long-lived cache header.

## 14. Master list and brand helpers

The admin editor can choose related content from other files through a master list API.

Relevant endpoints:

- `GET /api/master-list` returns sanitized arrays from approved content sources
- `GET /api/solutions` returns the solution list for picker UIs
- `GET/POST /api/brands` supports brand creation and retrieval

These routes help the CMS maintain relationships between brands, solutions, services, and news items without manual duplication.

## 15. Styling, motion, and UX details

The site uses Tailwind utility classes as the primary styling layer.

Important UX behaviors:

- responsive navigation with mobile menu
- animated page transition patterns via Framer Motion
- scroll reveal behavior for content sections
- hero and carousel-style presentation for marketing content
- floating WhatsApp contact action on public pages

The admin UI is intentionally denser than the public site and focuses on data editing, history, and validation feedback.

## 16. Local development

The most direct local startup path is Docker Compose:

```bash
docker compose up --build
```

This starts:

- Redis
- the web app

The compose file mounts:

- `./data` into the container for persistent JSON state
- `./logs` for runtime logs

Useful project commands:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run docs:pdf
```

Because the repository includes `pnpm-lock.yaml`, pnpm is also a natural package manager choice, but the scripts themselves work through standard npm commands.

## 17. Environment variables

The codebase expects environment configuration for the admin and session infrastructure. Important variables include:

- `ADMIN_PASSWORD`
- `ADMIN_TOTP_SECRET`
- `SESSION_SECRET`
- `ADMIN_ALLOWED_HOSTS`
- `NEXT_PUBLIC_ADMIN_CANONICAL_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

`.env.local` is used by the Docker Compose setup.

## 18. Security and operational notes

The application has several built-in safeguards that should be preserved when extending it:

- admin routes are host-restricted
- login and content writes are rate limited
- uploads are type-checked and content-verified
- path traversal checks are present in file-serving routes
- read-only fields are protected during content save operations
- content changes are backed up before writes
- route revalidation keeps static rendering in sync with updated JSON

Operationally, the JSON-first model makes recovery and inspection straightforward because the data is stored as files rather than hidden in a database.

## 19. Documentation regeneration

This document should stay versioned alongside the application so it can be regenerated whenever routes, content models, or admin flows change.

Generated PDF output:

- `my-app/public/docs/project-documentation.pdf`

Source document:

- `my-app/docs/project-documentation.md`

## 20. Summary

This project is a file-backed Next.js website with a CMS-like admin layer, automatic backups, and route revalidation. The clean separation between public pages, JSON content, and admin tooling makes it relatively easy to extend while keeping the operational model simple.
