# RISE Sports Foundation

Website for RISE Sports Foundation, a community sports organization in Mayuge District, Uganda. It includes public information about the foundation and its soccer leagues, an editable admin panel, a contact inbox, and an image library.

## Requirements

- Node.js 20.9 or later
- npm
- A Supabase project

## Configure Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/migrations/20261126000000_create_rise_storage.sql`](supabase/migrations/20261126000000_create_rise_storage.sql).
3. Copy `.env.example` to `.env.local` and set your project URL, server-side secret key, and a random `SESSION_SECRET` of at least 32 characters. Set `ADMIN_PASSWORD` to a unique password for the first admin sign-in if you are not migrating an existing password hash.
4. Keep `SUPABASE_SECRET_KEY` and `SESSION_SECRET` only in server or hosting environment settings. Never expose them in browser code or variables named `NEXT_PUBLIC_*`.

The migration creates JSONB content storage, the contact message inbox, a hashed admin credential table, and a private `rise-uploads` Storage bucket. Row Level Security is enabled and there are no browser access policies. The app uses Supabase only from server code.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and `/admin` for the control panel. Without Supabase configuration, public pages use the checked-in `content/site.json` seed, but edits, messages, uploads, and password changes do not persist; admin login uses a development-only fallback. Configure Supabase for normal use.

## Migrate existing local data

After applying the SQL migration and setting Supabase variables, run this from the project directory. PowerShell users can load `.env.local` values into their current shell or use Node's `--env-file` option:

```bash
node --env-file=.env.local scripts/migrate-to-supabase.mjs
```

The script migrates `content/site.json`, ignored local contact messages and password hash when present, and supported images from `content/uploads/`. It can be rerun safely for the same records and image names. Keep a backup of local files until the Supabase project is confirmed.

## Production

Set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and a unique `SESSION_SECRET` (32+ characters) in the hosting provider's server environment. Set `ADMIN_PASSWORD` only if no migrated credential is in Supabase; after a password change, the stored salted scrypt hash takes precedence. Then build and start:

```bash
npm run build
npm start
```

Uploaded files are stored in the private Supabase bucket and streamed through the Next.js `/uploads/...` route. The route serves public site images; do not upload private documents.

## Project layout

| Path | Purpose |
| --- | --- |
| `app/` | Next.js pages, layouts, metadata, and API routes |
| `components/` | Public pages and admin interface |
| `content/site.json` | Starter content used to seed an empty Supabase project |
| `lib/content.ts` | Server-side Supabase content, messages, and image storage |
| `lib/auth.ts` | Admin password verification and signed sessions |
| `lib/supabase.ts` | Server-only Supabase client |
| `supabase/migrations/` | Database tables and private Storage bucket setup |
| `scripts/migrate-to-supabase.mjs` | One-time migration for existing file-backed data |
| `scripts/assets.mjs` | Generates the local asset manifest |
| `ADMIN-README.md` | Admin panel guide |

## Useful commands

```bash
npm run dev       # Develop at localhost:3000
npm run build     # Generate assets and build the production app
npm start         # Serve the production build
npm run typecheck # Check TypeScript types
npm run assets    # Regenerate the local asset manifest
```

Local images and logos live under `public/images/` and `public/logos/`. The asset script creates `lib/assets.generated.json` from available local assets. The contact form validates submissions and applies basic in-memory rate limiting; messages are saved to Supabase and are not automatically emailed.

## Technology

Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod, and Supabase.
