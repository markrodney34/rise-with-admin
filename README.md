# RISE Sports Foundation

Website for RISE Sports Foundation, a community sports organization in Mayuge District, Uganda. It includes public information about the foundation and its soccer leagues, an editable admin panel, a contact inbox, and an image library.

## Requirements

- Node.js 20.9 or later
- npm
- A Supabase project

## Connect Supabase (Windows / PowerShell)

The app is in the `rise` folder. If PowerShell is currently at `...ise-with-admin`, first enter the folder that contains `package.json`:

```powershell
cd .\rise
```

Create your Supabase project at [supabase.com/dashboard](https://supabase.com/dashboard). In that project:

1. Open **SQL Editor**, create a query, paste in the contents of [`supabase/migrations/20261126000000_create_rise_storage.sql`](supabase/migrations/20261126000000_create_rise_storage.sql), and run it.
2. Open the project's **Connect** dialog to copy the Project URL. Find the server secret key under **Project Settings → API Keys**. Use the `sb_secret_...` key.
3. In PowerShell, copy the example environment file, then open your private copy:

   ```powershell
   Copy-Item .env.example .env.local
   notepad .env.local
   ```

4. In Notepad, replace the example values with your real values:

   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_your_real_key
   SESSION_SECRET=paste-a-random-secret-at-least-32-characters-long
   ADMIN_PASSWORD=choose-a-unique-admin-password
   ```

   Save and close Notepad. Keep the secret key and session secret private. Do not send them in chat or put them in code that runs in a browser. Supabase's secret key bypasses Row Level Security, so this project uses it only in server code. See [Supabase's API key guidance](https://supabase.com/docs/guides/getting-started/api-keys).

5. Install and start the app from this same `rise` folder:

   ```powershell
   npm install
   npm run dev
   ```

   Visit `http://localhost:3000`, then open `http://localhost:3000/admin` to sign in with `ADMIN_PASSWORD`.

`.env.local` is intentionally ignored by Git and won't appear in a normal File Explorer view because its name begins with a dot. In File Explorer, turn on **View → Show → Hidden items**. In PowerShell, `Get-ChildItem -Force .env*` lists both environment files. The checked-in `.env.example` contains placeholders only; put your real keys in `.env.local`.

The SQL migration creates JSONB content storage, the contact message inbox, a hashed admin credential table, and a private `rise-uploads` Storage bucket. Row Level Security is enabled and there are no browser access policies. The app uses Supabase only from server code.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and `/admin` for the control panel. Without Supabase configuration, public pages use the checked-in `content/site.json` seed, but edits, messages, uploads, and password changes do not persist; admin login uses a development-only fallback. Configure Supabase for normal use.

## Migrate existing local data

After applying the SQL migration and saving `.env.local`, run this from the `rise` project directory to import existing local messages, password hash, and uploaded images:

```powershell
npm run migrate:supabase
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
