# RISE website: Admin panel

Open **/admin** on your site (e.g. http://localhost:3000/admin) and sign in.

## Run it
```bash
npm install
cp .env.example .env.local     # then edit ADMIN_PASSWORD and SESSION_SECRET
npm run build && npm start     # or: npm run dev
```
No ADMIN_PASSWORD set? The default is `rise-admin`. The panel warns you. Change it under **Account**.

## What the admin controls
| Section | Controls |
|---|---|
| Site & contact | name, URL, email, phone, address, tagline, social links (footer, contact page, SEO) |
| Home page | hero text, "Who we are", mission/vision/values, impact figures, call-to-action |
| About page | title, paragraphs, side box |
| Leagues | Senior / Junior / Girls: name, blurb, intro, objectives, key figures, "why girls chose soccer" |
| Our journey | timeline milestones (add, edit, reorder, delete) |
| Partners & funders | partner cards and funder list |
| Highlights gallery | upload photos, captions, categories (filter buttons), reorder, delete |
| Page photos & logo | hero, about, CTA, league photos, logo; media library |
| League tables | seasons and clubs for all leagues and netball; auto-calculates P, GD, Pts and positions |
| Navigation | main menu and drop-down links |
| Privacy & terms | full text of both pages |
| Messages | inbox for the website contact form (reply, mark read, delete) |
| Account | change the admin password |

Press **Save & publish** in a section and the live site updates immediately.

## How it works
- Content lives in `content/site.json` (seeded from your original site text and tables).
- Contact-form messages go to `content/messages.json`. Uploaded photos go to `content/uploads/` (served at `/uploads/...`).
- Admin login uses a signed, HTTP-only cookie (12 h), login rate-limiting and hashed password storage.
- The admin API is in `app/api/admin/*`; the editor UI is `components/admin/AdminApp.tsx`.

## Hosting note (important)
The panel saves to files, so host on something with a **writable, persistent disk**: a VPS, Render/Railway/Fly with a volume, or `npm start` on any server. Set `DATA_DIR` to that disk.
It will **not** persist on read-only/serverless hosts (e.g. Vercel). For those, swap `lib/content.ts` for a database (every read and write goes through that one file).

## Notes
- Back up the `content/` folder: it is your whole site's data.
- Pasted external image URLs must be from hosts listed in `next.config.mjs`; uploaded images work anywhere.
