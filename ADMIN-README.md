# RISE website admin panel

Open `/admin` on the site and sign in. Before using the panel, configure Supabase and run the SQL migration described in [README.md](README.md#configure-supabase). The server needs `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and a unique `SESSION_SECRET` of at least 32 characters.

For local development, copy `.env.example` to `.env.local`, fill in those values, then run:

```bash
npm install
npm run dev
```

`ADMIN_PASSWORD` is an optional initial password when no password hash has been migrated. Passwords changed through the panel are stored as salted scrypt hashes in Supabase. Existing local content, messages, password hashes, and photos can be imported with `node --env-file=.env.local scripts/migrate-to-supabase.mjs`.

## What the admin controls

| Section | Controls |
|---|---|
| Site & contact | Name, URL, email, phone, address, tagline, social links |
| Home page | Hero text, organization information, mission, impact, call to action |
| About page | Title, paragraphs, side box |
| Leagues | Senior, Junior, and Girls league details and objectives |
| Our journey | Timeline milestones |
| Partners & funders | Partner cards and funder list |
| Highlights gallery | Uploaded photos, captions, categories, order, delete |
| Page photos & logo | Page images and media library |
| League tables | Seasons, clubs, and standings |
| Navigation | Main menu and dropdown links |
| Privacy & terms | Text for both pages |
| Messages | Contact form inbox, mark read, delete |
| Account | Change the admin password |

Changes are saved to Supabase and shown on the live site. Uploaded images are kept in the private `rise-uploads` bucket and served by the site for display.

## Security and backups

Keep the Supabase secret key and session secret in server environment settings only. Never add them to client-side code or `NEXT_PUBLIC_*` variables. The database tables have Row Level Security enabled with no browser access policies; the server secret key is used only in server modules. Back up the Supabase database and Storage bucket using your Supabase project backup process.
