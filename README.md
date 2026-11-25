# RISE Sports Foundation

Website for RISE Sports Foundation, a community sports organization in Mayuge District, Uganda. The site presents the foundation, its senior, junior, and girls soccer leagues, highlights, contact information, and league standings. It also includes an admin area for managing site content.

## Features

- Responsive public website with Home, About, Senior Soccer, Junior Soccer, Girls Soccer, Highlights, Contact, Privacy, and Terms pages.
- Editable site copy, navigation, partners, photos, league data, privacy and terms content through `/admin`.
- Contact form with input validation, a honeypot field, basic in-memory rate limiting, and a persistent message inbox.
- Image uploads served from `/uploads/...` and editable JSON content stored on disk.
- Admin authentication using a 12-hour HTTP-only signed session cookie; password changes use a salted scrypt hash and invalidate existing sessions.
- Generated sitemap, robots rules, metadata, and SportsOrganization structured data.

## Requirements

- Node.js 20.9 or later
- npm

## Run locally

```bash
npm install
```

Copy `.env.example` to `.env.local`, then set a strong admin password and session secret:

```env
ADMIN_PASSWORD=use-a-long-unique-password
SESSION_SECRET=replace-with-at-least-32-random-characters
# DATA_DIR=./content
```

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin](http://localhost:3000/admin) for the control panel. A built-in development fallback is available locally when no password has been configured. Production login stays disabled until a strong `ADMIN_PASSWORD` and an independent `SESSION_SECRET` of at least 32 characters are set.

## Production

Build and run the production server:

```bash
npm run build
npm start
```

Set `ADMIN_PASSWORD` and `SESSION_SECRET` in the hosting environment. Set `DATA_DIR` to a writable, persistent directory if the host does not preserve the app's working directory between deploys. The app writes editable site content, admin password data, contact messages, and uploaded images there. A serverless or read-only deployment without persistent storage will lose admin changes and messages; use a persistent volume or replace the file-backed storage in `lib/content.ts` with a database.

## Project layout

| Path | Purpose |
| --- | --- |
| `app/` | Next.js App Router pages, layouts, metadata, and API routes |
| `components/` | Public site components and the admin interface |
| `content/site.json` | Seed content and league tables |
| `content/auth.json` | Runtime password hash; ignored by Git |
| `content/messages.json` | Runtime contact inbox; ignored by Git |
| `content/uploads/` | Runtime uploaded images; ignored by Git |
| `lib/content.ts` | File-backed content, message, and upload storage |
| `lib/auth.ts` | Admin password and session handling |
| `scripts/assets.mjs` | Generates the local asset manifest used by the site |
| `ADMIN-README.md` | Detailed guide to the admin panel |

## Useful commands

```bash
npm run dev       # Develop at localhost:3000
npm run build     # Generate assets and build the production app
npm start         # Serve the production build
npm run typecheck # Check TypeScript types
npm run assets    # Regenerate the local asset manifest
```

## Images

Local images and logos live under `public/images/` and `public/logos/`. The asset script creates `lib/assets.generated.json` from available local assets. The Next.js image configuration currently allows remote images from `risemayugesports.org`; add any other trusted host to `next.config.mjs` before using its images.

## Data and security notes

- Back up the configured data directory: it contains the editable site data, contact messages, password hash, and uploaded files.
- Do not commit `.env.local`, secrets, private contact messages, or user-uploaded content. The repository ignores local environment files and runtime message, auth, and upload files.
- Change the fallback admin password and configure a random session secret before public deployment.
- The contact inbox is stored by this app; form submissions are not automatically emailed.

## Technology

Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, and Zod.
